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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Mint from './Mint';
// import { convertImgToBase64URL } from '../utils';
import IndexedDb from '../IndexedDb';
import './styles.scss';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));


const MenuBar = ({ editor } : any) => {
  const [editable, setEditable] = useState<boolean>(true);
  const [level, setLevel] = React.useState('1');
  const [alignment, setAlignment] = React.useState('left');
  const [formats, setFormats] = React.useState(['normal']);

  const handleLevel = (event: SelectChangeEvent) => {
    const l = event.target.value;
    setLevel(l);
    editor.chain().focus().toggleHeading({ level: l }).run();
  };

  const handleColor = (event: any) => {
    const target = event.target as HTMLInputElement;
    let val = target.value;
    editor.chain().focus().setColor(val).run();
  };

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    setFormats(newFormats);
    console.log('formats = ', newFormats);
    return;
    // todo
    for (const format of newFormats) {
      switch (format) {
        case 'bold':
          editor.chain().focus().unsetBold().run();
          break;
        case 'italic':
          editor.chain().focus().unsetItalic().run();
          break;
        case 'underlined':
          editor.chain().focus().unsetUnderline().run();
          break;
        case 'strikethrough':
          editor.chain().focus().unsetStrike().run();
          break;
        case 'color':
          editor.chain().focus().unsetColor().run();
          break;
        default:
          break;
      }
    }
  };

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
    switch (newAlignment) {
      case 'left':
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'center':
        editor.chain().focus().setTextAlign('center').run();
        break;
      case 'right':
        editor.chain().focus().setTextAlign('right').run();
        break;
      case 'justify':
        editor.chain().focus().setTextAlign('justify').run();
        break;
      default:
        break;
    }
  };
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string>('');
  useEffect(() => {
    if (!editor) {
      return undefined
    }
    editor.setEditable(editable)
  }, [editor, editable]);

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
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('URL');
    if (url) {
      // convertImgToBase64URL(url, 'image/png', function(base64Img){
      //   editor.chain().focus().setImage({ src: base64Img }).run();
      // });
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const htmlExample = '<p>Example <strong>Text</strong></p>'
  const htmlImport = useCallback(() => {
    editor.commands.setContent(htmlExample)
  }, [editor]);

  const htmlExport: any = useCallback(() => {
    let content = editor.getHTML()
    console.log(content)
    return content
  }, [editor]);
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
  }, [editor]);
  
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
    console.log('url = ',url);
    a.download = 'yourArticle.json';
    a.href = url;
    a.setAttribute('style', 'display: none');
    a.click();
    a.remove();
    // free up storage--no longer needed.
    URL.revokeObjectURL(url);
    setFileDownloadUrl('');
  }, [editor]);

  const generateHTMLFromJSON = useMemo(() => {
    return generateHTML(jsonExample, [
      StarterKit,
      Image
    ])
  }, [jsonExample]);

  const generateJSONFromHTML = useMemo(() => {
    return generateJSON(htmlExample, [
      StarterKit,
      Image
    ])
  }, [htmlExample]);

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
        marginTop: '2rem'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          flexWrap: 'wrap',
        }}
      >
        <StyledToggleButtonGroup
          size="small"
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton value="left" aria-label="left aligned">
            <FormatAlignLeftIcon />
          </ToggleButton>
          <ToggleButton value="center" aria-label="centered">
            <FormatAlignCenterIcon />
          </ToggleButton>
          <ToggleButton value="right" aria-label="right aligned">
            <FormatAlignRightIcon />
          </ToggleButton>
          <ToggleButton value="justify" aria-label="justified">
            <FormatAlignJustifyIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
        <StyledToggleButtonGroup
          size="small"
          value={formats}
          onChange={handleFormat}
          aria-label="text formatting"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="strikethrough" aria-label="strikethrough">
            <StrikethroughSIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color">
            <FormatColorTextIcon />
            <input
              type="color"
              onInput={handleColor}
              value={editor.getAttributes('textStyle').color}
            />
            <ArrowDropDownIcon />
          </ToggleButton>
        </StyledToggleButtonGroup>
        <IconButton onClick={() => editor.chain().focus().toggleCode().run()}>
          <CodeIcon />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          <FormatClearIcon />
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
        <Box>
          <Select
            value={level}
            onChange={handleLevel}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={1}>h1</MenuItem>
            <MenuItem value={2}>h2</MenuItem>
            <MenuItem value={3}>h3</MenuItem>
            <MenuItem value={4}>h4</MenuItem>
            <MenuItem value={5}>h5</MenuItem>
            <MenuItem value={6}>h6</MenuItem>
          </Select>
        </Box>
        <IconButton onClick={addImage}> 
          <AddPhotoAlternateIcon />
        </IconButton>
        <IconButton onClick={setLink}>
          <AddLinkIcon />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().undo().run()}>
          <UndoIcon />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().redo().run()}>
          <RedoIcon />
        </IconButton>
      </Paper>
      
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
          checked={editable}
          onChange={event => {
            setEditable(event.target.checked);
          }}
        />
        <label htmlFor="editable">editable</label>
      </div>
      <Mint />
    </div>
  );
}

const Editor = () => {
  useEffect(() => {
    const runIndexDb = async () => {
      const dbName = 'articles';
      const indexedDb = new IndexedDb('article-db');
      await indexedDb.createObjectStore(['articles'], ['address', 'timestamp']);
      let testval = {
        id: 1,
        title: 'Thrones',
        address: 'abc',
        desc: 'A Game of Thrones',
        body: 'bala bala A Game of Thrones',
        timestamp: Date.parse(new Date().toString()),
      };
      let testval1 = {
        id: 2,
        title: 'Fire And Ice',
        address: 'def',
        desc: 'A Song of Fire and Ice',
        body: 'bala bala A Song of Fire and Ice',
        timestamp: Date.parse(new Date().toString()),
      };
      let testval2 = {
        id: 3,
        title: 'Harry Potter',
        address: 'ghi',
        desc: 'Harry Potter and the Chamber of Secrets',
        body: 'bala bala Harry Potter and the Chamber of Secrets',
        timestamp: Date.parse(new Date().toString()),
      };
      // await indexedDb.putValue(dbName, testval);
      await indexedDb.putBulkValue(dbName, [testval, testval1]);
      // await indexedDb.getValue(dbName, 1);
      await indexedDb.getValueByIndex(dbName, 'address');
      // await indexedDb.getAllValue(dbName);
      // await indexedDb.deleteValue(dbName, 1);
    }
    // runIndexDb();
  }, []);
  useEffect(() => {
    const handlePasteAnywhere = (event: any) => {
      event.preventDefault();
      const { clipboardData } = event;
      const { items } = clipboardData;
      const { length } = items;
      // blob中就是截图的文件，获取后可以上传到服务器
      let blob = null;
      for (let i = 0; i < length; i++) {
        const item = items[i];
        console.log('clipboardData item type  ==> ', item.type);
        console.log('clipboardData ==> ', clipboardData.getData(item.type));
        // if (item.type.startsWith('image')) {
        //   blob = item.getAsFile();
        //   console.log('blob ==', blob);
        // }
        /*
          1. 从网上粘贴文字段落
              从 clipboardData 中的 取出
              text/plain 文字（纯文字）
              text/html (包含图片，遍历、正则找到 img http/https 替换为 服务器的图片地址）

          2. 从本地粘贴文字段落
              从 clipboardData 中的 取出
              text/plain 文字（纯文字）
              text/html (包含图片，遍历、正则找到 img file:///  替换为 服务器的图片地址）

          3. 粘贴图片
              截图
              复制图片
              data:image/png;base64,base64编码的png图片数据

          4. 组装数据，插入到光标坐在位置    
        */
      }
    };
  
    window.addEventListener('paste', handlePasteAnywhere);
  
    return () => {
      window.removeEventListener('paste', handlePasteAnywhere);
    };
  }, []);

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
    <h1>NFT</h1>
    <blockquote>
    <p>维基百科</p>
    </blockquote>
    <p>
    <strong>非同质化代币</strong> 
    <span style="color: rgb(32, 33, 34)">（英语：</span><code>Non-Fungible Token</code><span style="color: rgb(32, 33, 34)">，简称：</span> <strong>NFT</strong> <span style="color: rgb(32, 33, 34)">），是一种被称为</span> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E5%8C%BA%E5%9D%97%E9%93%BE">区块链</a> <span style="color: rgb(32, 33, 34)">数位账本上的数据单位，每个代币可以代表一个独特的</span> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E6%95%B8%E7%A2%BC%E8%B3%87%E6%96%99">数码资料</a> <span style="color: rgb(32, 33, 34)">，作为虚拟商品所有权的电子认证或凭证。由于其不能互换的特性，非同质化代币可以代表数位资产，如：</span></p><ul><li><p> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E7%BB%98%E7%94%BB">画作</a> </p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E8%97%9D%E8%A1%93%E5%93%81">艺术品</a> </p></li><li><p> <a target="_blank" rel="noopener noreferrer nofollow" class="mw-redirect" href="https://zh.m.wikipedia.org/wiki/%E8%81%B2%E9%9F%B3">声音</a> </p></li><li><p> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E8%A7%86%E9%A2%91">影片</a> </p></li><li><p> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E6%B8%B8%E6%88%8F">游戏</a> </p></li></ul><p><span style="color: rgb(32, 33, 34)">中的项目或其他形式的创意作品。虽然作品本身是可以无限复制的，但这些代表它们的代币在其底层区块链上能被完整追踪，故能为买家提供所有权证明。</span> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/zh-hans/NFT#cite_note-%2469_million_for_digital_art?-1">[1]</a> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/zh-hans/NFT#cite_note-Forbes_2021-02-28-2">[2]</a> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/zh-hans/NFT#cite_note-3">[3]</a> <span style="color: rgb(32, 33, 34)">诸如</span><a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E4%BB%A5%E5%A4%AA%E5%9D%8A">以太币</a> <span style="color: rgb(32, 33, 34)">、</span><a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E6%AF%94%E7%89%B9%E5%B8%81">比特币</a> <span style="color: rgb(32, 33, 34)">等</span><a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E5%8A%A0%E5%AF%86%E8%B2%A8%E5%B9%A3">加密货币</a> <span style="color: rgb(32, 33, 34)">都有自己的代币标准以定义对</span><em><span style="color: rgb(32, 33, 34)">NFT</span></em><span style="color: rgb(32, 33, 34)">的使用</span><a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/zh-hans/NFT#cite_note-4">[4]</a> <span style="color: rgb(32, 33, 34)">。</span></p><p>非同质化代币是一种储存在区块链（数位账本）上的数据单位，它可以代表艺术品等独一无二的数位资产。 其是一种<u>加密代币</u>，但与比特币等加密货币不同，其不可互换。 一个非同质化代币是透过上传一个文件，如艺术品，到非同质化代币拍卖市场，此举将创建一个记录在数位账本上的文件副本，以作为非同质化代币，可以透过加密货币来购买和转售。 虽然创作者可以出售代表该作品的非同质化代币，但他们仍然可以保留作品的版权，并创造更多的同一作品的非同质化代币。 非同质化代币的买家并不能获得对作品的独家访问权，买家也不能获得对原始数位文件的独占性。 将某一作品作为非同质化代币上传的人不必证明他们是原创艺术家，在许多争议案例中，在未经创作者许可的情况下，艺术品被盗用于非同质化代币。
    </p>
    <p></p>
    <h2>Non-fungible token</h2>
    <blockquote><p><span style="color: rgb(32, 33, 34)">From Wikipedia, the free encyclopedia</span></p></blockquote>
    <p>
    A <strong>non-fungible token</strong> (<strong>NFT</strong>) is a <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Security_(finance)">financial security</a> consisting of digital data stored in a <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Blockchain">blockchain</a>, a form of <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Distributed_ledger">distributed ledger</a>. The ownership of an NFT is recorded in the blockchain, and can be transferred by the owner, allowing NFTs to be sold and traded. NFTs can be created by anybody, and require few or no coding skills to create.<a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Non-fungible_token#cite_note-1">[1]</a> NFTs typically contain references to <a target="_blank" rel="noopener noreferrer nofollow" class="mw-redirect" href="https://en.wikipedia.org/wiki/Digital_file">digital files</a> such as</p><ul><li><p>photos</p></li><li><p>videos</p></li><li><p>audio</p></li><li><p>...</p></li></ul><p> Because NFTs are uniquely identifiable, they differ from <a target="_blank" rel="noopener noreferrer nofollow" class="mw-redirect" href="https://en.wikipedia.org/wiki/Cryptocurrencies">cryptocurrencies</a>, which are <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Fungibility">fungible</a>. The <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Market_value">market value</a> of an NFT is associated with the digital file it references.</p><p>Proponents of NFTs claim that NFTs provide a public <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Certificate_of_authenticity">certificate of authenticity</a> or <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Title_(property)">proof of ownership</a>, but the legal rights conveyed by an NFT can be uncertain. The ownership of an NFT as defined by the blockchain has no inherent legal meaning, and does not necessarily grant <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Copyright">copyright</a>, <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Intellectual_property">intellectual property</a> rights, or other legal rights over its associated digital file. An NFT does not restrict the sharing or copying of its associated digital file, and does not prevent the creation of NFTs that reference identical files.</p><p>The <strong>NFT</strong> market grew dramatically from 2020–2021: the trading of NFTs in 2021 increased to more than $17 billion, up by 21,000% over 2020's total of $82 million.<a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Non-fungible_token#cite_note-2">[2]</a> NFTs have been used as <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Speculation">speculative</a> investments, and they have drawn increasing criticism for the energy cost and <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Carbon_footprint">carbon footprint</a> associated with validating blockchain transactions as well as their frequent use in <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Confidence_trick">art scams</a>.<a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Non-fungible_token#cite_note-3">[3]</a> The NFT market has also been compared to an <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Economic_bubble">economic bubble</a> or a <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Ponzi_scheme">Ponzi scheme</a>.<a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Non-fungible_token#cite_note-4">[4]</a> By May 2022, the NFT market was seen as beginning to collapse.<a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Non-fungible_token#cite_note-flatlining-5">[5]</a></p><p>
    </p>
    `,
    autofocus: 1,
  });

  return (
    <div
      style={{
        width: '70%',
        margin:' 0 auto'
      }}
    >
      <MenuBar editor={editor} />
      <div id='editorContainer'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Editor;