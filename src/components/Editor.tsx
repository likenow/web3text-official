import '../styles.css';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { generateHTML, generateJSON } from '@tiptap/html';
import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { IconButton } from '@mui/material';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import DataObjectIcon from '@mui/icons-material/DataObject';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import TranslateIcon from '@mui/icons-material/Translate';
import AddLinkIcon from '@mui/icons-material/AddLink';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';

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
      <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
        <FormatBoldIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
        <FormatItalicIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleStrike().run()}>
        <StrikethroughSIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleCode().run()}>
        <CodeIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        <FormatClearIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <FormatUnderlinedIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <FormatListBulletedIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <FormatListNumberedIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <DataObjectIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <FormatQuoteIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <HorizontalRuleIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().undo().run()}>
        <UndoIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().redo().run()}>
        <RedoIcon />
      </IconButton>
      <IconButton onClick={addImage}> 
        <AddPhotoAlternateIcon />
      </IconButton>
      <br />
      <div>
        <IconButton>
          <FormatColorTextIcon />
        </IconButton>
        <input
          type="color"
          onInput={event => {
            const target = event.target as HTMLInputElement;
            let val = target.value;
            editor.chain().focus().setColor(val).run();
          }}
          value={editor.getAttributes('textStyle').color}
        />
        <button
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        >
          purple
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#F98181').run()}
          className={editor.isActive('textStyle', { color: '#F98181' }) ? 'is-active' : ''}
        >
          red
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#FBBC88').run()}
          className={editor.isActive('textStyle', { color: '#FBBC88' }) ? 'is-active' : ''}
        >
          orange
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#FAF594').run()}
          className={editor.isActive('textStyle', { color: '#FAF594' }) ? 'is-active' : ''}
        >
          yellow
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#70CFF8').run()}
          className={editor.isActive('textStyle', { color: '#70CFF8' }) ? 'is-active' : ''}
        >
          blue
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#94FADB').run()}
          className={editor.isActive('textStyle', { color: '#94FADB' }) ? 'is-active' : ''}
        >
          teal
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#B9F18D').run()}
          className={editor.isActive('textStyle', { color: '#B9F18D' }) ? 'is-active' : ''}
        >
          green
        </button>
        <button onClick={() => editor.chain().focus().unsetColor().run()}>unsetColor</button>
      </div>
      <br />
      <IconButton>
        <AddLinkIcon />
      </IconButton>
      <IconButton>
      <FileDownloadOffIcon />
      </IconButton>
      <IconButton>
      <FileUploadIcon />
      </IconButton>
      <IconButton>
      <FileDownloadIcon />
      </IconButton>
      <IconButton>
        <TranslateIcon />
      </IconButton>
      <br />
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
      Image,
      TextStyle,
      Color,
      Underline
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