import type { Data } from "@puckeditor/core";
import type { Components } from "./config";
import { placeholderImages } from "./placeholders";

export const sampleData: Data<Components> = {
  root: {
    props: {
      title: "Gabriel Ceslov — Portfolio",
    },
  },
  content: [
    {
      type: "Hero",
      props: {
        id: "hero-1",
        heading: "Gabriel Ceslov",
        subheading: "Photographer & visual storyteller based in Prague.",
        backgroundImage: placeholderImages.hero,
      },
    },
    {
      type: "Text",
      props: {
        id: "text-1",
        heading: "About",
        body: "I'm a photographer focused on quiet, honest moments — portraits, landscapes, and the spaces between. This page is a work in progress, built to explore how I'd like to present my work online.",
        align: "left",
      },
    },
    {
      type: "Image",
      props: {
        id: "image-1",
        image: placeholderImages.featuredImage,
        caption: "Featured work, 2025",
        size: "wide",
      },
    },
    {
      type: "Gallery",
      props: {
        id: "gallery-1",
        columns: "3",
        images: [
          { image: placeholderImages.gallery1, caption: "Morning light" },
          { image: placeholderImages.gallery2, caption: "Old town" },
          { image: placeholderImages.gallery3, caption: "Portrait study" },
          { image: placeholderImages.gallery4, caption: "Quiet street" },
        ],
      },
    },
  ],
};
