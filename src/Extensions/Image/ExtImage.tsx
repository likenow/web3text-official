import {
  mergeAttributes,
  Node,
  nodeInputRule,
} from '@tiptap/core';

import { Plugin, PluginKey } from 'prosemirror-state';

export interface ImageOptions {
  inline: boolean,
  allowBase64: boolean,
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: { src: string, alt?: string, title?: string }) => ReturnType,
    }
  }
}

export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const Image = Node.create<ImageOptions>({
  name: 'image',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? 'img[src]'
          : 'img[src]:not([src^="data:"])',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const myattr = {
      src: HTMLAttributes.src,
      alt: HTMLAttributes.alt,
      title: HTMLAttributes.title
    };
    console.log('myattr = ', myattr);
    return ['img', mergeAttributes(this.options.HTMLAttributes, myattr)];
  },

  addCommands() {
    return {
      setImage: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [,, alt, src, title] = match

          return { src, alt, title }
        },
      }),
    ]
  },
  // addProseMirrorPlugins() {
  //   return [
  //     new Plugin({
  //       key: new PluginKey('eventHandler'),
  //       props: {
  //         handleDOMEvents: {
  //           paste: (view, event: Event) => {
  //             // const html = (event as ClipboardEvent).clipboardData?.getData('text/html');
  //             event.preventDefault();
  //             return false;
  //           },
  //         },
  //         // … and many, many more.
  //         // Here is the full list: https://prosemirror.net/docs/ref/#view.EditorProps
  //       },
  //     }),
  //   ]
  // },
});