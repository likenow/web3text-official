import './styles.scss';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
// import Image from '@tiptap/extension-image';
// import Image from '../Extensions/Image';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
// import { generateHTML, generateJSON } from '@tiptap/html';
import React, { useEffect, useCallback, useState } from 'react';
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
// import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import DataObjectIcon from '@mui/icons-material/DataObject';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import EditOffIcon from '@mui/icons-material/EditOff';
import Mint from './Mint';
// import { getDownloadSafeImgSrc, getImgSrcs } from '../utils';
import IndexedDb from '../IndexedDb';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { EventBus } from '../EventBus/index';
import { styled } from '@mui/material/styles';
import { get, subscribe } from '../store';
import { useTranslation } from 'react-i18next';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';

interface Props {
  children: React.ReactElement;
}

function ScrollTop(props: Props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const tbName = 'articles';
const dbName = 'article-db';
const addressIdx = 'address';
const timestampIdx = 'timestamp';


const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const StyledButtonGroup = styled(ButtonGroup)({
  // change the text color for all buttons
  '& .MuiButtonGroup-grouped': {
    color: '#575C63',
  },
  // change the button group dividers color
  '& .MuiButtonGroup-grouped:not(:last-of-type)': {
    borderColor: 'white'
  }
});

const MenuBar = ({ editor } : any) => {
  const [editable, setEditable] = useState<boolean>(true);
  const [level, setLevel] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // const editableHandler = () => {
  //   if (editable) {
  //     setEditable(false);
  //   } else {
  //     setEditable(true);
  //   }
  // }

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setLevel(index);
    let l = index+1;
    editor.chain().focus().toggleHeading({ level: l }).run();
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clickInputColor = () => {
    const target = document.getElementById('colorInput') as HTMLInputElement;
    target.click();
  };

  const handleColor = (event: any) => {
    const target = event.target as HTMLInputElement;
      let val = target.value;
      editor.chain().focus().setColor(val).run();
  };

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

  // const addImage = useCallback(() => {
  //   const url = window.prompt('URL');
  //   if (url) {
  //     // convertImgToBase64URL(url, 'image/png', function(base64Img){
  //     //   editor.chain().focus().setImage({ src: base64Img }).run();
  //     // });
  //     editor.chain().focus().setImage({ src: url }).run();
  //   }
  // }, [editor]);

  useEffect(() => {
    const handleImportHtmlFile = (content: string)=> {
      if(content) {
        editor.commands.setContent(content);
      } else {
        console.log('content empty !!!');
      }
    };
    const e = EventBus.getInstance().register('import_html_file_event', handleImportHtmlFile);
    
    return function cleanup() {
      e.unregister();
    };
  });

  useEffect(() => {
    const handleDownloadHtmlFile = () => {
      const a: HTMLAnchorElement = document.createElement('a');
      document.body.appendChild(a);
      let content = editor.getHTML();
      const blob = new Blob([content], {type: 'text/html'});
      const url = URL.createObjectURL(blob);
      console.log('url = ',url);
      a.download = 'YourArticle.html';
      a.href = url;
      a.setAttribute('style', 'display: none');
      a.click();
      a.remove();
      // free up storage--no longer needed.
      URL.revokeObjectURL(url);
    };
    const e = EventBus.getInstance().register('download_html_file_event', handleDownloadHtmlFile);
    return function cleanup() {
      e.unregister();
    };
  });

  useEffect(() => {
    const handleEvent = ()=> {
      const htmlExample = `<h1>Non-fungible token</h1>
      <blockquote><p><span style="color: rgb(32, 33, 34)">From Wikipedia, the free encyclopedia</span></p></blockquote>
      <p>
      A <strong>non-fungible token</strong> (<strong>NFT</strong>) is a <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Security_(finance)">financial security</a> consisting of digital data stored in a <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Blockchain">blockchain</a>, a form of <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Distributed_ledger">distributed ledger</a>. The ownership of an NFT is recorded in the blockchain, and can be transferred by the owner, allowing NFTs to be sold and traded. NFTs can be created by anybody, and require few or no coding skills to create.<a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Non-fungible_token#cite_note-1">[1]</a> NFTs typically contain references to <a target="_blank" rel="noopener noreferrer nofollow" class="mw-redirect" href="https://en.wikipedia.org/wiki/Digital_file">digital files</a> such as</p><ul><li><p>photos</p></li><li><p>videos</p></li><li><p>audio</p></li><li><p>...</p></li></ul><p> Because NFTs are uniquely identifiable, they differ from <a target="_blank" rel="noopener noreferrer nofollow" class="mw-redirect" href="https://en.wikipedia.org/wiki/Cryptocurrencies">cryptocurrencies</a>, which are <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Fungibility">fungible</a>. The <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Market_value">market value</a> of an NFT is associated with the digital file it references.</p><p>Proponents of NFTs claim that NFTs provide a public <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Certificate_of_authenticity">certificate of authenticity</a> or <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Title_(property)">proof of ownership</a>, but the legal rights conveyed by an NFT can be uncertain. The ownership of an NFT as defined by the blockchain has no inherent legal meaning, and does not necessarily grant <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Copyright">copyright</a>, <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Intellectual_property">intellectual property</a> rights, or other legal rights over its associated digital file. An NFT does not restrict the sharing or copying of its associated digital file, and does not prevent the creation of NFTs that reference identical files.</p><p>The <strong>NFT</strong> market grew dramatically from 2020–2021: the trading of NFTs in 2021 increased to more than $17 billion, up by 21,000% over 2020's total of $82 million.<a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Non-fungible_token#cite_note-2">[2]</a> NFTs have been used as <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Speculation">speculative</a> investments, and they have drawn increasing criticism for the energy cost and <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Carbon_footprint">carbon footprint</a> associated with validating blockchain transactions as well as their frequent use in <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Confidence_trick">art scams</a>.<a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Non-fungible_token#cite_note-3">[3]</a> The NFT market has also been compared to an <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Economic_bubble">economic bubble</a> or a <a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Ponzi_scheme">Ponzi scheme</a>.<a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Non-fungible_token#cite_note-4">[4]</a> By May 2022, the NFT market was seen as beginning to collapse.<a target="_blank" rel="noopener noreferrer nofollow" href="https://en.wikipedia.org/wiki/Non-fungible_token#cite_note-flatlining-5">[5]</a></p><p>
      </p>
      <h2>NFT</h2>
      <blockquote>
      <p>维基百科</p>
      </blockquote>
      <p>
      <strong>非同质化代币</strong> 
      <span style="color: rgb(32, 33, 34)">（英语：</span><code>Non-Fungible Token</code><span style="color: rgb(32, 33, 34)">，简称：</span> <strong>NFT</strong> <span style="color: rgb(32, 33, 34)">），是一种被称为</span> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E5%8C%BA%E5%9D%97%E9%93%BE">区块链</a> <span style="color: rgb(32, 33, 34)">数位账本上的数据单位，每个代币可以代表一个独特的</span> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E6%95%B8%E7%A2%BC%E8%B3%87%E6%96%99">数码资料</a> <span style="color: rgb(32, 33, 34)">，作为虚拟商品所有权的电子认证或凭证。由于其不能互换的特性，非同质化代币可以代表数位资产，如：</span></p><ul><li><p> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E7%BB%98%E7%94%BB">画作</a> </p></li><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E8%97%9D%E8%A1%93%E5%93%81">艺术品</a> </p></li><li><p> <a target="_blank" rel="noopener noreferrer nofollow" class="mw-redirect" href="https://zh.m.wikipedia.org/wiki/%E8%81%B2%E9%9F%B3">声音</a> </p></li><li><p> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E8%A7%86%E9%A2%91">影片</a> </p></li><li><p> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E6%B8%B8%E6%88%8F">游戏</a> </p></li></ul><p><span style="color: rgb(32, 33, 34)">中的项目或其他形式的创意作品。虽然作品本身是可以无限复制的，但这些代表它们的代币在其底层区块链上能被完整追踪，故能为买家提供所有权证明。</span> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/zh-hans/NFT#cite_note-%2469_million_for_digital_art?-1">[1]</a> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/zh-hans/NFT#cite_note-Forbes_2021-02-28-2">[2]</a> <a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/zh-hans/NFT#cite_note-3">[3]</a> <span style="color: rgb(32, 33, 34)">诸如</span><a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E4%BB%A5%E5%A4%AA%E5%9D%8A">以太币</a> <span style="color: rgb(32, 33, 34)">、</span><a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E6%AF%94%E7%89%B9%E5%B8%81">比特币</a> <span style="color: rgb(32, 33, 34)">等</span><a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/wiki/%E5%8A%A0%E5%AF%86%E8%B2%A8%E5%B9%A3">加密货币</a> <span style="color: rgb(32, 33, 34)">都有自己的代币标准以定义对</span><em><span style="color: rgb(32, 33, 34)">NFT</span></em><span style="color: rgb(32, 33, 34)">的使用</span><a target="_blank" rel="noopener noreferrer nofollow" href="https://zh.m.wikipedia.org/zh-hans/NFT#cite_note-4">[4]</a> <span style="color: rgb(32, 33, 34)">。</span></p><p>非同质化代币是一种储存在区块链（数位账本）上的数据单位，它可以代表艺术品等独一无二的数位资产。 其是一种<u>加密代币</u>，但与比特币等加密货币不同，其不可互换。 一个非同质化代币是透过上传一个文件，如艺术品，到非同质化代币拍卖市场，此举将创建一个记录在数位账本上的文件副本，以作为非同质化代币，可以透过加密货币来购买和转售。 虽然创作者可以出售代表该作品的非同质化代币，但他们仍然可以保留作品的版权，并创造更多的同一作品的非同质化代币。 非同质化代币的买家并不能获得对作品的独家访问权，买家也不能获得对原始数位文件的独占性。 将某一作品作为非同质化代币上传的人不必证明他们是原创艺术家，在许多争议案例中，在未经创作者许可的情况下，艺术品被盗用于非同质化代币。
      </p>
      <p></p>`;
      editor.commands.setContent(htmlExample);
    };
    const e = EventBus.getInstance().register('disconnect_wallet_event', handleEvent);
    
    return function cleanup() {
      e.unregister();
    };
  });

  useEffect(() => {
    const handleEvent = (address: string)=> {
      (async () => {
        const connectedImportHtmlFile = async ()=> {
          if(address.length > 0) {
            const indexedDb = new IndexedDb(dbName);
            await indexedDb.createObjectStore([tbName], [addressIdx, timestampIdx]);
            let ret = await indexedDb.getValueByIndex(tbName, addressIdx);
            if (ret[0]) {
              const body = ret[0]['body'];
              console.log('body =', body);
              editor.commands.setContent(body);
            } else {
              console.log('result empty !!!');
            }
          } else {
            console.log('address empty !!!');
          }
        };
        console.log('editor connected_wallet_event');
        connectedImportHtmlFile();
       })();
    };
    const e = EventBus.getInstance().register('connect_wallet_event', handleEvent);
    
    return function cleanup() {
      e.unregister();
    };
  });

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: '1',
        top: '100',
        left: '50%',
        transform: 'translate(-50%)',
        width: 'fit-content',
        boxSizing: 'content-box',
        backgroundColor: 'white',
        opacity: 0.9
      }}
    >
      <StyledButtonGroup variant="text" aria-label="button group">
        {/* <Button onClick={editableHandler} sx={editable?{
          color: '#1976d2'
        }:{
          color: '#d32f2f'
        }}>
          <EditOffIcon />
        </Button> */}
        <Button onClick={() => editor.chain().focus().undo().run()}>
          <UndoIcon />
        </Button>
        <Button onClick={() => editor.chain().focus().redo().run()}>
          <RedoIcon />
        </Button>
        <Button
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {levels[level]}
          <ArrowDropDownIcon />
        </Button>
        <Button onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}>
          <FormatBoldIcon />
        </Button>
        <Button onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}>
          <FormatItalicIcon />
        </Button>
        <Button onClick={() => {
          editor.chain().focus().toggleUnderline().run();
        }}>
          <FormatUnderlinedIcon />
        </Button>
        <Button onClick={() => {
          editor.chain().focus().toggleStrike().run();
        }}>
          <StrikethroughSIcon />
        </Button>
        <Button onClick={clickInputColor} value="color" aria-label="color">
          <input
            style={{
              width: 1,
              height: 1,
              marginTop: 22,
              opacity: 0
            }}
            id="colorInput"
            type="color"
            onInput={handleColor}
            value={editor.getAttributes('textStyle').color}
          />
          <FormatColorTextIcon sx={{ color: editor.getAttributes('textStyle').color}} />
          <ArrowDropDownIcon />
        </Button>
        <Button onClick={() => {
          editor.chain().focus().setTextAlign('left').run();
        }}>
          <FormatAlignLeftIcon />
        </Button>
        <Button onClick={() => {
          editor.chain().focus().setTextAlign('center').run();
        }}>
          <FormatAlignCenterIcon />
        </Button>
        <Button onClick={() => {
          editor.chain().focus().setTextAlign('right').run();
        }}>
          <FormatAlignRightIcon />
        </Button>
        <Button onClick={() => {
          editor.chain().focus().setTextAlign('justify').run();
        }}>
          <FormatAlignJustifyIcon />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FormatListBulletedIcon />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FormatListNumberedIcon />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleCode().run()}>
          <CodeIcon />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <DataObjectIcon />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <FormatQuoteIcon />
        </Button>
        <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <HorizontalRuleIcon />
        </Button>
        <Button onClick={setLink}>
          <AddLinkIcon />
        </Button>
        {/* <Button onClick={addImage}> 
          <AddPhotoAlternateIcon />
        </Button> */}
        <Mint />
      </StyledButtonGroup>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuList id="split-button-menu" autoFocusItem>
          {levels.map((l, index) => (
            <MenuItem
              key={l}
              selected={index === level}
              onClick={(event) => handleMenuItemClick(event, index)}
            >
              {l}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
}

const Editor = () => {
  const [address, setAddress] = useState(null);
  const { t } = useTranslation();
  const htmlExample = '<h1>' + t('pleaseTitle') +'</h1>' +'<p>' + t('pleaseBody') + '</p>';
  useEffect(() => {
    const addressInStore = get('address') || null;
    if (addressInStore) {
      setAddress(addressInStore);
    }
    subscribe('address', () => {
      const addressInStore = get('address') || null;
      setAddress(addressInStore);
    });
  }, []);
  
  /// https://tiptap.dev/extensions tiptap扩展
  /// https://tiptap.dev/api/extensions/ tiptap扩展文档
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      // Image.configure({
      //   allowBase64: true
      // }),
      TextStyle,
      Color,
      Link.configure({
        protocols: ['ftp', 'mailto'],
        openOnClick: false,
      }),
      Underline
    ],
    content: htmlExample,
    autofocus: 1,
  });

  const articleBody = (address: string) => {
    if (!editor) {
      console.log('articleBody editor is null');
      return;
    }
    let content = editor.getHTML();
    console.log('address = ', address);
    let article = {
      id: 1,
      title: '',
      address: address,
      desc: '',
      body: content,
      timestamp: Date.now(),
    };
    return article;
  }

  useEffect(() => {
    if (!editor) {
      console.log('editor is null');
      return;
    }
    const onUpdate = () => {
      // The content has changed.
      const saveArticle = async () => {
        let addr: string = 'abcdefghijklmn';
        let content = null
        if (address) {
          addr = address;
          content = articleBody(addr);
        }
        console.log('saveArticle addr = ', addr);
        // 存入 idb
        if (content) {
          console.log('saveArticle have conent');
          const indexedDb = new IndexedDb(dbName);
          await indexedDb.createObjectStore([tbName], [addressIdx, timestampIdx]);
          await indexedDb.putValue(tbName, content);
        }
      }
      saveArticle();
    }
    editor.on('update', onUpdate);

    return function cleanup() {
      // … and unbind.
      editor.off('update', onUpdate);
    }
  }, [editor, address]);

  if (!editor) {
    return null;
  }

  editor.on('create', ({ editor }) => {
    // The editor is ready.
    (async () => {
      const indexedDb = new IndexedDb(dbName);
      await indexedDb.createObjectStore([tbName], [addressIdx, timestampIdx]);
      const connectedImportHtmlFile = async (address: any)=> {
        console.log('connectedImportHtmlFile');
        if(address) {
          let ret = await indexedDb.getValueByIndex(tbName, addressIdx);
          if (ret[0]) {
            const body = ret[0]['body'];
            console.log('body =', body);
            editor.commands.setContent(body);
          } else {
            console.log('result empty !!!');
          }
        } else {
          console.log('address empty !!!');
        }
      };
      
      console.log('editor ready connected_wallet_event');
      connectedImportHtmlFile(address);
     })();
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <Offset id="back-to-top-anchor" />
      <div id='editorContainer'
        style={{
          width: '70%',
          margin:'0 auto',
        }}
      >
        <EditorContent editor={editor} />
      </div>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </div>
  )
}

export default Editor;