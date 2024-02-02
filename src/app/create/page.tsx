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
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';
import { useSession } from '@clerk/nextjs';

const defaultErrorState = {
  title: '',
  imageA: '',
  imageB: '',
};

export default function CreatePage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createThumbnail = useMutation(api.thumbnails.createThumbnail);
  const [imageA, setImageA] = useState('');
  const [imageB, setImageB] = useState('');
  const [errors, setErrors] = useState(defaultErrorState);
  const router = useRouter();
  const { toast } = useToast();
  const session = useSession();
  return (
    <div className="mt-16">
      <h1 className="text-4xl font-bold">Upload a Jersey!</h1>
      <p className="text-lg max-w-md mb-8">
        Upload your favorite jersey for others to rate! You can upload your
        favourite team jersey or your own custom creations!
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const title = formData.get('title') as string;
          let newErrors = {
            ...defaultErrorState,
          };

          if (!title) {
            newErrors = {
              ...newErrors,
              title: 'please fill in this required field',
            };
          }

          if (!imageA) {
            newErrors = {
              ...newErrors,
              imageA: 'please fill in this required field',
            };
          }

          if (!imageB) {
            newErrors = {
              ...newErrors,
              imageB: 'please fill in this required field',
            };
          }

          setErrors(newErrors);
          const hasErrors = Object.values(newErrors).some(Boolean);

          if (hasErrors) {
            toast({
              title: 'Form Errors',
              description: 'Please fill fields on the page',
              variant: 'destructive',
            });
            return;
          }

          const thumbnailId = await createThumbnail({
            aImage: imageA,
            bImage: imageB,
            title,
            profileImage: session.session?.user.imageUrl,
          });
          router.push(`/thumbnails/${thumbnailId}`);
        }}
      >
        <div className="flex flex-col gap-4 mb-8">
          <Label htmlFor="title">Title</Label>
          <Input
            required
            id="title"
            type="text"
            name="title"
            placeholder="Label your compare to make it easier to distribute"
            className={clsx({
              border: errors.title,
              'border-red-500': errors.title,
            })}
          />
          {errors.title && <div className="text-red-500"> {errors.title}</div>}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div
            className={clsx('flex flex-col gap-4 rounded p-2', {
              border: errors.imageA,
              'border-red-500': errors.imageA,
            })}
          >
            <h2 className="text-2xl font-bold text-center">Test Image A</h2>
            {imageA && (
              <Image
                width="200"
                height="200"
                alt="jersey a"
                src={getImageUrl(imageA)}
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
            {errors.imageA && (
              <div className="text-red-500"> {errors.imageA}</div>
            )}
          </div>
          <div
            className={clsx('flex flex-col gap-4 rounded p-2', {
              border: errors.imageB,
              'border-red-500': errors.imageB,
            })}
          >
            <h2 className="text-2xl font-bold text-center">Test Image B</h2>
            {imageB && (
              <Image
                width="200"
                height="200"
                alt="jersey b"
                src={getImageUrl(imageB)}
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
            {errors.imageB && (
              <div className="text-red-500"> {errors.imageB}</div>
            )}
          </div>
        </div>
        <Button>Create Jersey compare</Button>
      </form>
    </div>
  );
}
