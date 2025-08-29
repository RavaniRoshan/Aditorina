import React from 'react';
import { Card, CardContent } from './ui/card';

const reviews = [
  {
    name: 'Sarah L.',
    handle: '@photoWizard',
    review: 'PhotoCursor AI is a game-changer. I turned a boring selfie into a cyberpunk masterpiece in seconds. The AI is incredibly intuitive!',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    name: 'Mark C.',
    handle: '@pixelPerfect',
    review: "As a professional designer, I'm blown away. The Figma-like interface combined with powerful AI tools makes my workflow so much faster.",
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
  },
  {
    name: 'Jessica P.',
    handle: '@creativeSoul',
    review: "I'm not a pro, but this app makes me feel like one. Adding text and brush strokes is super easy, and the results look amazing.",
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
  },
  {
    name: 'David H.',
    handle: '@techExplorer',
    review: 'The \'nano-banana\' model is ridiculously fast and creative. I love experimenting with different prompts just to see what it comes up with.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
  },
   {
    name: 'Emily R.',
    handle: '@artIsLife',
    review: "Finally, a photo editor that's both powerful and fun to use. The layer system is fantastic for non-destructive editing. Highly recommend!",
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
  },
   {
    name: 'Chris T.',
    handle: '@mobileCreator',
    review: "I can't believe this runs in the browser. It's faster than most desktop apps I've used. The export quality is top-notch too.",
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d',
  },
];

const ReviewCard: React.FC<(typeof reviews)[0]> = ({ name, handle, review, avatar }) => (
    <Card className="w-80 flex-shrink-0 mr-8">
        <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
                <img src={avatar} alt={name} className="w-12 h-12 rounded-full border-2 border-brand-primary/50" />
                <div>
                    <p className="font-semibold text-dark-text-primary">{name}</p>
                    <p className="text-sm text-dark-text-tertiary">{handle}</p>
                </div>
            </div>
            <p className="mt-4 text-sm text-dark-text-secondary">"{review}"</p>
        </CardContent>
    </Card>
);

export const InfiniteReviews: React.FC = () => {
    const row1Reviews = reviews.slice(0, Math.ceil(reviews.length / 2));
    const row2Reviews = reviews.slice(Math.ceil(reviews.length / 2));

    const duplicatedRow1 = [...row1Reviews, ...row1Reviews];
    const duplicatedRow2 = [...row2Reviews, ...row2Reviews];

    return (
        <section className="py-24 relative z-10 overflow-hidden">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl font-bold text-center mb-12">Loved by Creatives Everywhere</h2>
            </div>
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                <div className="flex w-max animate-scroll-x">
                    {duplicatedRow1.map((review, index) => (
                        <ReviewCard key={`row1-${review.handle}-${index}`} {...review} />
                    ))}
                </div>
            </div>
             <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] mt-8">
                <div className="flex w-max animate-scroll-x-reverse">
                    {duplicatedRow2.map((review, index) => (
                        <ReviewCard key={`row2-${review.handle}-${index}`} {...review} />
                    ))}
                </div>
            </div>
        </section>
    );
};