import type { CSSProperties } from "react";
import type { Config } from "@puckeditor/core";
import { imageField } from "./ImageField";

export type GalleryImage = {
  image: string;
  caption: string;
};

export type Components = {
  Hero: {
    heading: string;
    subheading: string;
    backgroundImage: string;
  };
  Text: {
    heading: string;
    body: string;
    align: "left" | "center";
  };
  Image: {
    image: string;
    caption: string;
    size: "normal" | "wide";
  };
  Gallery: {
    columns: "2" | "3" | "4";
    images: GalleryImage[];
  };
  Project: {
    title: string;
    role: string;
    year: string;
    description: string;
    image: string;
    link: string;
  };
};

export const config: Config<Components> = {
  categories: {
    content: {
      title: "Content",
      components: ["Hero", "Text"],
    },
    media: {
      title: "Media",
      components: ["Image", "Gallery"],
    },
    showcase: {
      title: "Showcase",
      components: ["Project"],
    },
  },
  components: {
    Hero: {
      fields: {
        heading: { type: "text", label: "Heading" },
        subheading: { type: "textarea", label: "Subheading" },
        backgroundImage: { ...imageField, label: "Background image" },
      },
      defaultProps: {
        heading: "Your Name Here",
        subheading: "A short tagline about your work.",
        backgroundImage: "",
      },
      render: ({ heading, subheading, backgroundImage }) => (
        <section
          className="pv-hero"
          style={
            backgroundImage
              ? { backgroundImage: `url(${backgroundImage})` }
              : undefined
          }
        >
          <div className="pv-hero__overlay">
            <h1 className="pv-hero__heading">{heading}</h1>
            <p className="pv-hero__subheading">{subheading}</p>
          </div>
        </section>
      ),
    },
    Text: {
      fields: {
        heading: { type: "text", label: "Heading (optional)" },
        body: { type: "textarea", label: "Body" },
        align: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
      },
      defaultProps: {
        heading: "",
        body: "Write a short paragraph about yourself or your work here.",
        align: "left",
      },
      render: ({ heading, body, align }) => (
        <section className={`pv-text pv-text--${align}`}>
          {heading && <h2 className="pv-text__heading">{heading}</h2>}
          <p className="pv-text__body">{body}</p>
        </section>
      ),
    },
    Image: {
      fields: {
        image: { ...imageField, label: "Image" },
        caption: { type: "text", label: "Caption (optional)" },
        size: {
          type: "radio",
          label: "Size",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Wide", value: "wide" },
          ],
        },
      },
      defaultProps: {
        image: "",
        caption: "",
        size: "normal",
      },
      render: ({ image, caption, size }) => (
        <section className={`pv-image pv-image--${size}`}>
          {image && <img src={image} alt={caption || "Section"} />}
          {caption && <p className="pv-image__caption">{caption}</p>}
        </section>
      ),
    },
    Gallery: {
      fields: {
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
          ],
        },
        images: {
          type: "array",
          label: "Images",
          arrayFields: {
            image: { ...imageField, label: "Image" },
            caption: { type: "text", label: "Caption (optional)" },
          },
          defaultItemProps: {
            image: "",
            caption: "",
          },
          getItemSummary: (item) => item.caption || "Untitled image",
        },
      },
      defaultProps: {
        columns: "3",
        images: [],
      },
      render: ({ columns, images }) => (
        <section
          className="pv-gallery"
          style={{ "--pv-gallery-cols": columns } as CSSProperties}
        >
          {images.map((item, i) => (
            <figure className="pv-gallery__item" key={i}>
              {item.image && <img src={item.image} alt={item.caption || ""} />}
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>
          ))}
        </section>
      ),
    },
    Project: {
      fields: {
        title: { type: "text", label: "Title" },
        role: { type: "text", label: "Role" },
        year: { type: "text", label: "Year" },
        description: { type: "textarea", label: "Description" },
        image: { ...imageField, label: "Image" },
        link: { type: "text", label: "Link (optional)" },
      },
      defaultProps: {
        title: "Project Title",
        role: "",
        year: "",
        description: "Describe this project.",
        image: "",
        link: "",
      },
      render: ({ title, role, year, description, image, link }) => (
        <section className="pv-project">
          {image && (
            <img className="pv-project__image" src={image} alt={title} />
          )}
          <div className="pv-project__details">
            <h3 className="pv-project__title">{title}</h3>
            {(role || year) && (
              <p className="pv-project__meta">
                {[role, year].filter(Boolean).join(" · ")}
              </p>
            )}
            <p className="pv-project__description">{description}</p>
            {link && (
              <a
                className="pv-project__link"
                href={link}
                target="_blank"
                rel="noreferrer"
              >
                View project ↗
              </a>
            )}
          </div>
        </section>
      ),
    },
  },
};
