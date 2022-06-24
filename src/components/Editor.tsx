import '../styles.css';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { generateHTML, generateJSON } from '@tiptap/html';
import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { IconButton } from '@mui/material';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';

import Mint from './Mint';


const MenuBar = ({ editor } : any) => {
  const [editable, setEditable] = useState<boolean>(false)
  useEffect(() => {
    if (!editor) {
      return undefined
    }
    editor.setEditable(editable)
  }, [editor, editable])
  
  const addImage = useCallback(() => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])
  const htmlExample = '<p>Example <strong>Text</strong></p>'
  const htmlImport = useCallback(() => {
    editor.commands.setContent(htmlExample)
  }, [editor])

  const htmlExport: any = useCallback(() => {
    let content = editor.getHTML()
    console.log(content)
    return content
  }, [editor])
  const jsonExample = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Example ',
          },
          {
            type: 'text',
            marks: [
              {
                type: 'bold',
              },
            ],
            text: 'Text',
          },
        ],
      },
    ],
  }
  const jsonImport = useCallback(() => {
    editor.commands.setContent(jsonExample)
  }, [editor])

  const jsonExport = useCallback(() => {
    let content = editor.getJSON()
    console.log(content)
    return content
  }, [editor])

  const generateHTMLFromJSON = useMemo(() => {
    return generateHTML(jsonExample, [
      StarterKit,
      Image
    ])
  }, [jsonExample])

  const generateJSONFromHTML = useMemo(() => {
    return generateJSON(htmlExample, [
      StarterKit,
      Image
    ])
  }, [htmlExample])

  const htmlFromJson = () => {
    console.log(generateHTMLFromJSON)
  }

  const jsonFromHtml = () => {
    console.log(generateJSONFromHTML)
  }
  
  if (!editor) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "5%",
        marginLeft: "15%",
        marginBottom: "5%"
      }}
    >
      <IconButton onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''} aria-label="center">
        <FormatAlignCenterIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''} aria-label="left">
        <FormatAlignLeftIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''} aria-label="right">
        <FormatAlignRightIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''} aria-label="justify">
        <FormatAlignJustifyIcon />
      </IconButton>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}>
        undo
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}>
        redo
      </button>
      <button onClick={addImage}> setImage </button>
      <button onClick={htmlExport}> Export HTML </button>
      <button onClick={htmlImport}> Import HTML </button>
      <button onClick={jsonExport}> Export JSON </button>
      <button onClick={jsonImport}> Import JSON </button>
      <button onClick={htmlFromJson}> Generate HTML from JSON </button>
      <button onClick={jsonFromHtml}> Generate JSON from HTML </button>
      <div className="checkbox">
        <input
          type="checkbox"
          id="editable"
          onChange={event => setEditable(event.target.checked)}
        />
        <label htmlFor="editable">editable</label>
      </div>
      <Mint />
    </div>
  );
}

const Editor = () => {
  /// https://tiptap.dev/extensions tiptap扩展
  /// https://tiptap.dev/api/extensions/ tiptap扩展文档
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image
    ],
    content: `
      <h2>
        Hi there,
      </h2>
      <p>
        this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
      </p>
      <ul>
        <li>
          That’s a bullet list with one …
        </li>
        <li>
          … or two list items.
        </li>
      </ul>
      <p>
        Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
      </p>
      <pre><code class="language-css">body {
  display: none;
}</code></pre>
      <p>
        I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
      </p>
      <blockquote>
        Wow, that’s amazing. Good work, boy! 👏
        <br />
        — Mom
      </blockquote>
      <p>This is a basic example of implementing images. Drag to re-order.</p>
      <img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />
    `,
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor;