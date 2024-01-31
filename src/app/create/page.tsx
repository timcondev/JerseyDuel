'use client';

import { UploadButton, UploadFileResponse } from '@xixixao/uploadstuff/react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { createThumbnail } from '../../../convex/thumbnails';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import clsx from 'clsx';

export default function CreatePage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.thumbnails.createThumbnail);
  const [imageA, setImageA] = useState('');
  const [imageB, setImageB] = useState('');
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  return (
    <div className="mt-16">
      <h1 className="text-4xl font-bold">Upload a Jersey!</h1>
      <p className="text-lg max-w-md mb-8">
        Upload your favorite jersey for others to rate! You can upload your
        favourite team jersey or your own custom creations!
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const title = formData.get('title') as string;
          setErrors(() => ({}));
          if (!title) {
            setErrors((currentErrors) => ({
              ...currentErrors,
              title: 'please fill in this required field',
            }));
          }
          if (!imageA) {
            setErrors((currentErrors) => ({
              ...currentErrors,
              title: 'please fill in this required field',
            }));
          }
          if (!imageB) {
            setErrors((currentErrors) => ({
              ...currentErrors,
              title: 'please fill in this required field',
            }));
          }

          if (!title || !imageA || !imageB) {
            setErrors('Please fill in all fields on the page');
            toast({
              title: 'Form Errors',
              description: 'Please fill in all fields',
              variant: 'destructive',
            });
            return;
          }

          createThumbnail({
            aImage: imageA,
            bImage: imageB,
            title,
          });
        }}
      >
        <div className="flex flex-col gap-4 mb-8">
          <Label htmlFor="title">Title</Label>
          <Input
            required
            id="title"
            type="text"
            placeholder="Label your compare to make it easier to distribute"
          />
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div
            className={clsx('flex flex-col gap-4', {
              'border-red-500': errors,
            })}
          >
            <h2 className="text-2xl font-bold text-center">Test Image A</h2>
            {imageA && (
              <Image
                width="200"
                height="200"
                alt="jersey a"
                src={`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${imageA}`}
              />
            )}
            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={['image/*']}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                setImageA((uploaded[0].response as any).storageId);
              }}
              onUploadError={(error: unknown) => {
                alert(`ERROR! ${error}`);
              }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center">Test Image B</h2>
            {imageB && (
              <Image
                width="200"
                height="200"
                alt="jersey b"
                src={`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${imageB}`}
              />
            )}
            <UploadButton
              uploadUrl={generateUploadUrl}
              fileTypes={['image/*']}
              onUploadComplete={async (uploaded: UploadFileResponse[]) => {
                setImageB((uploaded[0].response as any).storageId);
              }}
              onUploadError={(error: unknown) => {
                alert(`ERROR! ${error}`);
              }}
            />
          </div>
        </div>
        <Button>Create Jersey compare</Button>
      </form>
    </div>
  );
}
