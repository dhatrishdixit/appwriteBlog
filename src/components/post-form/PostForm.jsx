import React,{useCallback,useEffect} from 'react' ;
import { useNavigate} from 'react-router-dom' ;
import {useSelector} from 'react-redux' ;
import {Input,RTE,Select,Button} from '../index';
import {useForm} from 'react-hook-form';
import appwriteServices from '../../appwrite/config';

function PostForm({post}) {
    // TODO: check by using post only 
  const navigate = useNavigate();
  const {register,handleSubmit,watch,control,setValue,getValues} = useForm({
    defaultValues:{
         title:post?.title || "",
         slug:post?.$id || "",
         content:post?.content || "",
         status : post?.status || "public",
    }
  });
  const userData = useSelector(state=>state.auth.userData);
  const submitHandler = async (data) => {
    if(post){
        const file = data.image[0]? await appwriteServices.uploadFile(data.image[0]) :null;
        if(file){
            await appwriteServices.deleteFile(post.featuredImage);
            const updatedPost = await appwriteServices.updatePost(post.$id,{
                ...data,
                featuredImage : file ? file.$id : undefined
            })
            if(updatedPost){
                navigate(`/post/${updatedPost.$id}`)
            }
        }
       
    }
    else{
        const file = data.image[0] ? await appwriteServices.uploadFile(data.image[0]) : null ;
        if(file)
        {
            const newPost = await appwriteServices.createPost({
                ...data,
                userId:userData.$id,
                featuredImage : file ? file.$id : undefined
            })
            
        if(newPost){
            navigate(`/post/${newPost.$id}`)
        }
        }
    }
        
  }
  const slugTransform = useCallback((value) => {
       if(value && typeof value === 'string'){
        return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, '-')
        .replace(/\s/g, "-")
       }
       return "";
  },[])
  useEffect(()=>{
    const subscription = watch((value,{name,type})=>{
        console.log(name , type) ;
        if(name === 'title'){
            console.log(name , type) ;
            setValue('slug',slugTransform(value.title),{
                shouldValidate:true
            })
        }
    });
    return () => {
        subscription.unsubscribe();
    }

  },[watch,slugTransform,setValue])


  return (
    <form onSubmit={handleSubmit(submitHandler)} className='flex flex-wrap'>
        <div className='w-2/3 px-2'>
        <Input 
          labelText = 'Title: '
          placeholder='Title'
          type= 'text'
          className='mb-4'
          {...register('title',{
            required:true,
            minLength :3
          })}
        />
       {/* TODO: update this slug to be read only and use that to redirect to our objects*/}
        <Input 
          labelText = 'Slug :'
          placeholder = 'Slug'
          className = 'mb-4'
          {...register('slug',{
            required:true
          })}
          onInput={(e)=>{
            setValue('slug',slugTransform(e.target.value),{
                shouldValidate:true
            })
          }}
        />
        <RTE 
          labelText='Content: '
          name='content'
          control={control}
          defaultValue={getValues('content')}
        />
        </div>
        <div className='w-1/3 px-2'>
        <Input 
          labelText ='PostImage :'
          type ='file'
          placeholder = "Image"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register('image',{
             required:!post
          })}
        />
        { post && (
          <img
          src={appwriteServices.filePreview(post.featuredImage)}
          alt={post.title}
          className="rounded-xl"
      />

        )}
        <Select
         options={["public", "private"]}
         labelText="Status"
         className="mb-4"
         {...register("status", {required: true})}
                />
         <Button
            type='submit'
            bgColor={post ? 'bg-green-500':'bg-blue-500'}
         >
         {post ? 'update' : 'post'}
         </Button>
        </div>

    </form>
  )
}

export default PostForm