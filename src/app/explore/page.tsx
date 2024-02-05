'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSession } from '@clerk/nextjs';
import { Doc } from '../../../convex/_generated/dataModel';
export default function ExplorePage() {
  const {
    results: thumbnails,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.thumbnails.getRecentThumbnails,
    {},
    { initialNumItems: 10 }
  );
  const session = useSession();
  function hasVoted(thumbnail: Doc<'thumbnails'>) {
    if (!session.session) return false;
    return thumbnail.voteIds.includes(session.session?.user.id);
  }
  return (
    <div>
      <div className="my-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {thumbnails?.map((thumbnail) => {
          return (
            <Card key={thumbnail._id}>
              <CardHeader>
                <Image
                  src={getImageUrl(thumbnail.aImage)}
                  width="600"
                  height="600"
                  alt="thumbnail image"
                />
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center mb-2">
                  <Avatar>
                    <AvatarImage src={thumbnail.profileImage} alt="@shadcn" />
                    <AvatarFallback>AA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{thumbnail.name}</p>
                    <p>
                      {formatDistance(thumbnail._creationTime, new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <p>{thumbnail.title}</p>
                <p>votes: {thumbnail.aVotes + thumbnail.bVotes}</p>
              </CardContent>
              <CardFooter className="flex justify-center ">
                <Button
                  variant={hasVoted(thumbnail) ? 'outline' : 'default'}
                  className="w-3/4"
                  asChild
                >
                  <Link href={`/thumbnails/${thumbnail._id}`}>
                    {hasVoted(thumbnail) ? 'View Results' : 'Vote'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <Button
        className="w-full mb-24"
        disabled={status !== 'CanLoadMore'}
        onClick={() => {
          loadMore(10);
        }}
      >
        Load More
      </Button>
    </div>
  );
}
