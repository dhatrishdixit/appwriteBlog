import React from 'react';
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';
// can also use forwardRef

export default function RTE({name,labelText,control,defaultValue =""}) {
  return (
    <div className='w-full'>
        {labelText && <label className='inline-block mb-1 pl-1'>{labelText}</label>}
        <Controller
          name={name}
          control = {control}
          render={({field:{onChange}})=>(<Editor 
            initialValue={defaultValue}
            init={{
                initialValue: defaultValue,
                height: 500,
                menubar: true,
                plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "anchor",
                ],
                toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={onChange}
          />)}
        />

    </div>
  )
}

