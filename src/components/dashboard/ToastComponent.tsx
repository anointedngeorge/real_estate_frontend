import { toast } from '@/hooks/use-toast';
import React from 'react'




export const ToastComponent = ({title, content}: {title:string, content:string}) => {
    toast({
      title: title,
      description: content,
    })

}
