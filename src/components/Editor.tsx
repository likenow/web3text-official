import '../styles.css';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
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
import AddLinkIcon from '@mui/icons-material/AddLink';
import Mint from './Mint';
// import { convertImgToBase64URL } from '../utils';


const MenuBar = ({ editor } : any) => {
  const [editable, setEditable] = useState<boolean>(false);
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string>('');
  useEffect(() => {
    if (!editor) {
      return undefined
    }
    editor.setEditable(editable)
  }, [editor, editable])

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    // cancelled
    if (url === null) {
      return
    }
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    const url = window.prompt('URL');
    if (url) {
      // convertImgToBase64URL(url, 'image/png', function(base64Img){
      //   editor.chain().focus().setImage({ src: base64Img }).run();
      // });
      editor.chain().focus().setImage({ src: url }).run();
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
    const a: HTMLAnchorElement = document.createElement('a');
    document.body.appendChild(a);
    let content = editor.getJSON();
    // Prepare the file
    let output = JSON.stringify(content, null, 4);
    // console.log(output);
    const blob = new Blob([output], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    setFileDownloadUrl(url);
    // console.log(url);
    a.download = 'yourArticle.json';
    a.href = url;
    a.setAttribute('style', 'display: none');
    a.click();
    a.remove();
    // free up storage--no longer needed.
    URL.revokeObjectURL(url);
    setFileDownloadUrl('');
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
        marginTop: '5%',
        marginLeft: '15%',
        marginBottom: '5%'
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
      <IconButton onClick={setLink}>
        <AddLinkIcon />
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
      Image.configure({
        allowBase64: true
      }),
      TextStyle,
      Color,
      Link.configure({
        protocols: ['ftp', 'mailto'],
        openOnClick: false,
      }),
      Underline
    ],
    content: `
      <h2>
        Hi there,
      </h2>
      <p>
        this is a <em>basic</em> example of <strong>Prosemirror</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
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
      <p>
      在理解合约以及 DApp 使用何种方式与区块链进行交互后，开发者很快会意识到，我们并没有通过在本地建立一个节点的方式来与区块链进行操作。如果你在本地部署过 IPFS，你会很快发现它会默认在本地同步节点，就像 BT 下载软件那样。这是否意味着我们的 DApp 不够「去中心化」呢？
      </p>
      <p>
      实际上，仍然有大量的软件基于本地的全节点来进行交互，只是，对于大部分开发者而言，他们放弃了这样的权利，而转而使用更便利的 Relay Network 与区块链进行通信，通过这种方式，我们节省了部署成本，并且不再需要维护节点的状态缓存，对于快速构建 DApp 来说，选择一个靠谱的 Relay，是无可非议的方案。
      </p>
      <p>
      使用 Relay Network 不需要特殊的知识，在前端，我们使用上述提及的代码库（ethers.js 或者 web3.js）与 Relay 进行交互；在服务端，如果你使用 Node 运行环境，也可以直接拷贝前端的代码来使用。如果你使用其他的运行环境，你可能会需要一些特定的 JSON-RPC 函数包装，以访问这些 Relay。
      </p>
      <p>
      Infura 是世界上最早和最大的以太坊 Relay Network，它提供一些公开的 Gateway 节点，但一般来说，我们需要获取属于自己的 DApp Access Key 并为这些访问权限设置 origin 和 IP 限制，以提升使用我们自己的 DApp 用户的访问速度体验。Infura 目前支持 ETH，ETH2 网络，以及 IPFS 和 Filecoin 两个分布式储存方案。
      </p>
    `,
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <div id='editorContainer'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Editor;