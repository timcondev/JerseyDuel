'use client';

import { useMutation, useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { shuffle } from 'lodash';
import { Button } from '@/components/ui/button';
import { useSession } from '@clerk/nextjs';
import { Progress } from '@/components/ui/progress';
import { useRef } from 'react';

export default function ThumbnailPage() {
  const params = useParams<{ thumbnailId: Id<'thumbnails'> }>();
  const voteOnThumbnail = useMutation(api.thumbnails.voteOnThumbnail);
  const thumbnailId = params.thumbnailId;
  const thumbnail = useQuery(api.thumbnails.getThumbnail, {
    thumbnailId,
  });
  const images = useRef<string[] | undefined>(undefined);
  const session = useSession();
  if (!thumbnail || !session.session) {
    return <div>Loading...</div>;
  }
  if (!images.current) {
    images.current = shuffle([thumbnail.aImage, thumbnail.bImage]);
  }
  const [firstImageId, secondImageId] = images.current;
  const hasVoted = thumbnail.voteIds.includes(session.session.user.id);
  function getVotesFor(imageId: string) {
    if (!thumbnail) return 0;
    return thumbnail.aImage === imageId ? thumbnail.aVotes : thumbnail.bVotes;
  }
  function getVotePercent(imageId: string) {
    if (!thumbnail) return 0;
    const totalVotes = thumbnail.aVotes + thumbnail.bVotes;
    if (totalVotes === 0) return 0;
    return Math.round((getVotesFor(imageId) / totalVotes) * 100);
  }
  return (
    <div className="mt-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-center items-center gap-4">
          <h2 className="text-2xl font-bold text-center mb-2 md:text-4xl">
            Jersey A
          </h2>
          <Image
            width="400"
            height="400"
            alt="jersey a"
            className="w-3/4"
            src={getImageUrl(firstImageId)}
          />
          {hasVoted ? (
            <>
              <Progress
                value={getVotePercent(secondImageId)}
                className="w-[75%]"
              />
              <div className="text-lg">{getVotesFor(firstImageId)}</div>
            </>
          ) : (
            <Button
              onClick={() => {
                voteOnThumbnail({
                  thumbnail: thumbnailId,
                  imageId: firstImageId,
                });
              }}
              size="lg"
              className="w-fit"
            >
              Vote A
            </Button>
          )}
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          <h2 className="text-2xl font-bold text-center mb-2 md:text-4xl">
            Jersey B
          </h2>
          <Image
            width="400"
            height="400"
            alt="jersey a"
            className="w-3/4"
            src={getImageUrl(secondImageId)}
          />
          {hasVoted ? (
            <>
              <Progress
                value={getVotePercent(secondImageId)}
                className="w-[75%]"
              />
              <div className="text-lg">{getVotesFor(secondImageId)}</div>
            </>
          ) : (
            <Button
              onClick={() => {
                voteOnThumbnail({
                  thumbnail: thumbnailId,
                  imageId: secondImageId,
                });
              }}
              size="lg"
              className="w-fit"
            >
              Vote B
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
