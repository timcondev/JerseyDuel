'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { formatDistance } from 'date-fns';

export default function DashboardPage() {
  const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser);
  const sortedThumbnails = [...(thumbnails ?? [])].reverse();
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {sortedThumbnails?.map((thumbnail) => {
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
              <p>{thumbnail.title}</p>
              <p>
                {formatDistance(thumbnail._creationTime, new Date(), {
                  addSuffix: true,
                })}
              </p>
              <p>votes: {thumbnail.aVotes + thumbnail.bVotes}</p>
            </CardContent>
            <CardFooter className="flex justify-center ">
              <Button className="w-3/4" asChild>
                <Link href={`/thumbnails/${thumbnail._id}`}>View Results</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
