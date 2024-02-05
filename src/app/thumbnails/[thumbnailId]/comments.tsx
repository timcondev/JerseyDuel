'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Doc } from '../../../../convex/_generated/dataModel';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueries, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import { formatDistance } from 'date-fns';
import { useIsSubscribed } from '@/hooks/useIsSubscribed';
import { UpgradeButton } from '@/components/upgrade-button';

const formSchema = z.object({
  text: z.string().min(1).max(500),
});

export default function Comments({
  thumbnail,
}: {
  thumbnail: Doc<'thumbnails'>;
}) {
  const addComment = useMutation(api.thumbnails.addComment);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });
  const { toast } = useToast();
  const isSubscribed = useIsSubscribed();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    addComment({
      text: values.text,
      thumbnailId: thumbnail._id,
    })
      .then(() => {
        toast({
          title: 'Posted!',
          description: 'Thanks for commenting!',
          variant: 'default',
        });
        form.reset();
      })
      .catch(() => {
        toast({
          title: 'Something went wrong..',
          description: 'Check your post and try again.',
          variant: 'destructive',
        });
      });
  }

  return (
    <div>
      <h2 className="text-4xl font-bold text-center my-8">Comments</h2>
      <div className="max-w-lg mx-auto mb-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Let us know what you think!</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Post Comment</Button>
          </form>
        </Form>
        <div className="space-y-8 mt-12">
          {thumbnail.comments.map((comment) => {
            return (
              <div
                key={`${comment.text}_${comment.createdAt}`}
                className="border p-4 rounded"
              >
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={comment.profileUrl} />
                    <AvatarFallback>AA</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <div>{comment.name}</div>
                    <div>
                      {formatDistance(new Date(comment.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </div>
                    <div>{comment.text}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {!isSubscribed && (
            <div className="border p-8 rounded text-center space-y-4">
              <div>You must upgrade to see all the feedback left!</div>
              <UpgradeButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
