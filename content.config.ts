import { defineCollection, z } from '@nuxt/content';

const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']);
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'warning', 'success', 'info', 'azureradiance', 'blueviolet']);
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl']);
const orientationEnum = z.enum(['vertical', 'horizontal']);

const baseSchema = {
    title: z.string().nonempty(),
    description: z.string().nonempty(),
};

const linkSchema = z.object({
    label: z.string().nonempty(),
    to: z.string().nonempty(),
    icon: z.string().optional(),
    size: sizeEnum.optional(),
    trailing: z.boolean().optional(),
    target: z.string().optional(),
    color: colorEnum.optional(),
    variant: variantEnum.optional(),
});

const featureItemSchema = z.object({
    ...baseSchema,
    icon: z.string().nonempty(),
});

const sectionSchema = z.object({
    headline: z.string().optional(),
    ...baseSchema,
    features: z.array(featureItemSchema),
});

const authorsSchema = z.array(
    z.object({
        name: z.string().nonempty(),
        to: z.string().nonempty(),
        avatar: z.object({ src: z.string().nonempty() }),
    }),
);

export const collections = {
    docs: defineCollection({
        type: 'page',
        source: '1.docs/**/*.{md,yml}',
        schema: z.object({
            title: z.string().nonempty(),
            description: z.string().nonempty(),
        }),
    }),
    posts: defineCollection({
        type: 'page',
        source: '3.blog/**/*.{md,yml}',
        schema: z.object({
            title: z.string().nonempty(),
            description: z.string().nonempty(),
            image: z.object({ src: z.string().nonempty() }),
            authors: authorsSchema,
            date: z.string().nonempty(),
            badge: z.object({ label: z.string().nonempty() }),
        }),
    }),
    index: defineCollection({
        source: '0.index.yml',
        type: 'data',
        schema: z.object({
            title: z.string().nonempty(),
            description: z.string().nonempty(),
            hero: sectionSchema.extend({
                headline: z.object({
                    label: z.string().nonempty(),
                    to: z.string().nonempty(),
                    icon: z.string().nonempty(),
                }),
                links: z.array(linkSchema),
            }),
            sections: z.array(
                sectionSchema.extend({
                    id: z.string().nonempty(),
                    orientation: orientationEnum.optional(),
                    features: z.array(featureItemSchema),
                    links: z.array(linkSchema),
                    reverse: z.boolean().optional(),
                }),
            ),
            features: sectionSchema.extend({
                items: z.array(featureItemSchema),
            }),
            cta: sectionSchema.extend({
                links: z.array(linkSchema),
            }),
        }),
    }),
    blog: defineCollection({
        source: '3.blog.yml',
        type: 'data',
        schema: sectionSchema,
    }),
    content: defineCollection({
        source: {
            include: '*',
        },
        type: 'page',
        schema: z.object({
            title: z.string().nonempty(),
            description: z.string().nonempty(),
            authors: authorsSchema,
        }),
    }),
};
