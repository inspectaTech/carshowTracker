import {useEffect, useRef, useContext, useState} from 'react';

import {$getRoot, $getSelection} from 'lexical';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
// import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {ContentEditable} from '@lexical/react/LexicalContentEditable';

import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
// import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
// import { CLEAR_EDITOR_COMMAND } from 'lexical/LexicalCommands';
// import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import MyEditorRef from './plugins/MyEditorRef';
import MyCustomAutoFocusPlugin from './plugins/MyCustomAutoFocusPlugin';
import { FormContext } from '../../../Inform/lib/formContext';


import './Lexical.scss';
import './toolbars.scss';

import { obj_exists } from '../../../../tools/exists';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import PlaygroundAutoLinkPlugin from './plugins/AutoLinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import exampleTheme from './themes/ExampleTheme';
import { LoadInitialContent } from './plugins/LoadInitialContent';


const LexicalForm = (props) => {

  let data = props.data || props;

  let {
    onchange,
    tag = "",
  } = data;

  let iUN_ref = useRef(props.iUN || Math.round(Math.random() * 10000));
  let iUN = iUN_ref.current;
  const editorRef = useRef();
  const placeholder_ref = useRef();
  const late_call = useRef({});
  const [val, setVal] = useState(0); // integer state
  const forceUpdate = () => {
    setVal(val => ++val); // update the state to force render
  }// forceUpdate

  /** copied code */
  const FormStore = useContext(FormContext);

  let item_data = data.item_data || FormStore.item_data;
  let name = data.name || "note_data";
  let value = data.value || "text_data";

  let obj_data = obj_exists(item_data,`${name}`) ? item_data[`${name}`] : {};
  if(typeof obj_data == "string"){ 
    // convert legacy string values into objects
    // now i don't have to modify in the db
    let legacy_value = `${obj_data}`;
    obj_data = {editor: "lexical"};
    obj_data[`${value}`] = legacy_value;
  }// if

  // let text_data = (obj_exists(item_data,`${name}.${value}`)) ? item_data[`${name}`][`${value}`] : "";
  let text_data = (obj_exists(obj_data,`${value}`)) ? obj_data[`${value}`] : "";
  let allow_code = data.code || false;

  const callback = data.callback;

  // allow external access to editor properties
  let getEditorCallback = (typeof props.data != "undefined" && props.data.getEditorCallback) ? props.data.getEditorCallback :
  (props.getEditorCallback) ? props.getEditorCallback : undefined;

  const form_data = props.data.form;
  const { register, getValues, setValue } = form_data;// is this a global register or a local one - do i have to pass register as props
  // let register = props.register;
  let note_obj;
  // why am i using this structure instead of a ternary operator?
  // oh just in case it breaks when trying to use JSON.parse
  try {
    if(text_data != ""){
      note_obj = JSON.parse(unescape(text_data));
    }else{
      throw "no editor data available";
    }
  } catch (e) {
    console.debug("[Note] text_data conversion issue", e);
      note_obj = "";
    if(text_data == ""){
      let d_obj = {editor: "lexical"};
      d_obj[`${value}`] = "";

      // GOTCHA IMPORTANT - this creates an infinite loop on "" data
      // formStore.setData(name,d_obj);
    }// if
  }// catch

  // const [draftEditor, setDraftEditor] = (note_obj != "" && typeof note_obj == "object") ?
  // useState(EditorState.createWithContent(convertFromRaw(note_obj))) :
  // useState(EditorState.createEmpty());
  /** End copied code */

  const theme = {
    // Theme styling goes here ...
  };


  const focus_me = () => { 
    editorRef.current.focus();// WORKS
  }// focus_me // WORKS

  // useEffect(() => {

  //   if(raw_ref.current == undefined) return;
  //   let raw = raw_ref.current;
  //   let raw_string = JSON.stringify(raw)
  //   let is_same = last_ref.current == raw_string;
  //   if(callback && !is_same){
  //     last_ref.current = raw_string;
  //     callback(raw_string, draftEditor);
  //   }// if
  // },[draftEditor]);

  useEffect(() => {
    
    if(late_call?.current?.update_editor){
      late_call.current.update_editor()
      late_call.current = {};
    }// if
  }, [val])
  
  

  const update_editor = (editorState) => {

    if(0) console.log(`[LexicalForm][update_editor] dE`, editorState)
    const editor_str = JSON.stringify(editorState);
    if(0) console.log(`[LexicalForm][update_editor] dE string`, editor_str)
    // setDraftEditor(dE);

    let gES = editorRef?.current?.getEditorState ? editorRef.current.getEditorState() : "";
    let eStr = JSON.stringify(gES);
    debugger
    
    // let raw = editorState;
    // make sure some blocks have text
    // let has_text = raw.blocks.some((block) => {
    //   let test_text = block.text;
    //   test_text = test_text.trim();// this removes multiple spaces
    //   return test_text != "";
    // });

    let blocks = "";
    // if(has_text){
      // if some have text do this
      blocks = editor_str;// JSON.stringify(raw,null,2);
    // }

    // FormStore.setData(name,JSON.stringify(raw));
    // let send_data = {...obj_data, editor: "lexical", text_data: blocks};
    let send_data = {...obj_data, editor: "lexical"};
    send_data[`${value}`] = blocks;

    debugger
    if(callback){
      // is this ever used?
      if(1) console.warn(`[Note] callback used`,item_data);
      callback(name, send_data);
    }else{
      // otherwise use FormStore
      FormStore.setData(name, send_data);
    }// else

  };// update_editor

  const late_bell = () => { 
    late_call.current = {update_editor};
    forceUpdate();  
  }


  const onError = (error) => {
    console.error(error);
  };

  const onChange = (editorState) => {
    if(0) console.log(`[LexicalForm][onChange] editorState`,editorState);
    editorState.read(() => {
      // Read the contents of the EditorState here.
      // [editorState.read $ prefixed helper functions](https://lexical.dev/docs/concepts/editor-state)
      const root = $getRoot();
      const root_str = JSON.stringify(root);
      const selection = $getSelection();
      const editor_str = JSON.stringify(editorState);
      if(0) console.log(`[LexicalForm][onChange] root`, root);
      if(0) console.log(`[LexicalForm][onChange] root str`, root_str);
      if(0) console.log(`[LexicalForm][onChange] selection`, selection);
      if(0) console.log(`[LexicalForm][onChange] editor`, editor_str);// NOTE: this is what saves
    });
  };


  const initialConfig = {
    namespace: 'MyEditor',
    theme: exampleTheme,
    onError,
    // readOnly: true,
    // editorState: text_data,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ]
  };

  if(text_data != "") initialConfig.editorState = text_data;


  const initialContent = FormStore?.test_data?.raw ? FormStore?.test_data?.raw : null;
  if(FormStore?.test_data?.raw){
    FormStore.removeData(`raw`, true);
  }

  let placeholder_cls = `lexical_placeholder_${iUN} lexical_placeholder`;
  
  return (
    <div className={`lexical_wrapper ${tag}`} data-comp="LexicalForm" 
      onClick={(e)=>{
        /**
         * try to limit the event cascade to the wrapper; WORKS?
         * this is IMPORTANT - without it the click bubbles all the way
         * to the title input
        */
        e.preventDefault();
        e.stopPropagation();
      }}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <ToolbarPlugin tag={tag} hyperlinks={false}/>
          <div className="editor-inner">
            <RichTextPlugin
            contentEditable={<ContentEditable className={`LexicalForm entry contentEditable editor-input ${tag}`} />}
            placeholder={<div className={placeholder_cls} ref={placeholder_ref}
            onClick={focus_me}
            >Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
            />

            {/* <TreeViewPlugin /> */}
            {/* <AutoFocusPlugin /> */}
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <PlaygroundAutoLinkPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <LoadInitialContent {...{initialContent, callback: update_editor}} />

            <OnChangePlugin onChange={update_editor} />
            <HistoryPlugin />
            <MyCustomAutoFocusPlugin />
            <MyEditorRef ref={editorRef}/>
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}

export default LexicalForm;