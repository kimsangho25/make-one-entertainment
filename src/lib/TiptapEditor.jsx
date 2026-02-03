// src/lib/TiptapEditor.jsx 또는 src/components/TiptapEditor.jsx

import React, { useEffect } from 'react';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Mention } from '@tiptap/extension-mention';
import tippy from 'tippy.js';
// 🚨 CommandList.jsx의 실제 경로에 따라 './CommandList.jsx'를 수정해야 할 수 있습니다.
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import CommandList from './CommandList.jsx'; 


// -------------------------------------------------------------
// Suggestion (커맨드 목록) 정의 함수
// -------------------------------------------------------------
// Tiptap이 이 함수를 호출할 때 range와 editor가 전달되지만, 
// 여기서는 query만 사용하고 range, editor는 command 실행 시 사용하도록 준비합니다.
const getSuggestionItems = ({ query }) => {
    
    const items = [
        { 
            title: '제목 1', 
            // 🚨 수정: command 함수는 CommandList.jsx로부터 전체 props를 인수로 받습니다.
            command: (props) => { 
                const { editor, range } = props; // props에서 range를 안전하게 구조 분해
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
            },
        },
        { 
            title: '제목 2', 
            command: (props) => {
                const { editor, range } = props;
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
            },
        },
        { 
            title: '글머리 목록', 
            command: (props) => {
                const { editor, range } = props;
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
        },
        { 
            title: '번호 목록', 
            command: (props) => {
                const { editor, range } = props;
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            },
        },
        // 🚨 텍스트 색상 명령 추가
        { 
            title: '텍스트 빨간색', 
            command: (props) => {
                const { editor, range } = props;
                editor.chain().focus().deleteRange(range).setColor('#EF4444').run(); // Tailwind Red-500
            },
        },
        { 
            title: '텍스트 초기화', 
            command: (props) => {
                const { editor, range } = props;
                editor.chain().focus().deleteRange(range).unsetColor().run();
            },
        },
        // 🚨 하이라이트 명령 추가
        { 
            title: '하이라이트 노란색', 
            command: (props) => {
                const { editor, range } = props;
                editor.chain().focus().deleteRange(range).toggleHighlight({ color: '#FEF9C3' }).run(); // Tailwind Yellow-100
            },
        },
        { 
            title: '하이라이트 해제', 
            command: (props) => {
                const { editor, range } = props;
                editor.chain().focus().deleteRange(range).unsetHighlight().run();
            },
        },
    ];

    // 필터링만 수행합니다.
    return items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
};

// -------------------------------------------------------------
// 팝업 UI (tippy.js) 렌더링 함수
// -------------------------------------------------------------
const renderItems = () => {
    let component;
    let popup;

    return {
        onStart: (props) => {
            // ReactRenderer에 Tiptap이 전달한 props(editor, range 포함)를 그대로 전달
            component = new ReactRenderer(CommandList, { props, editor: props.editor });
            
            popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                zIndex: 9999,
            });
        },
        onUpdate(props) {
            component.updateProps(props);
            popup[0].setProps({ getReferenceClientRect: props.clientRect });
        },
        onKeyDown(props) {
            return component.ref?.onKeyDown(props);
        },
        onExit() {
            popup[0].destroy();
            component.destroy();
        },
    };
};


const TiptapEditor = ({ content, onChange, className }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
          heading: { levels: [1, 2] },
      }),
      // Color, TextStyle 확장 기능이 있다면 여기에 추가
      TextStyle.configure(),
      Color.configure({ types: [ 'textStyle' ] }),
      Highlight.configure({ 
        multicolor: true, // 여러 색상으로 하이라이트 가능
        defaultAttribute: 'yellow' // 기본 하이라이트 색상 설정
      }),
      // Mention 확장 기능을 슬래시 커맨드처럼 설정
      Mention.configure({
          suggestion: {
              char: '/', 
              items: getSuggestionItems, // Tiptap이 range, editor를 이 함수에 전달합니다.
              render: renderItems, 
          }
      }),
    ],
    content: content || null,
    editable: true,
    onUpdate: ({ editor }) => {
      // 변경된 JSON 객체를 AdminPage로 전달
      onChange(editor.getJSON());
    },
  }, []); 

  // 초기화 및 content 동기화 로직 (유지)
  useEffect(() => {
    if (!editor) return;
    if (content === null || content === undefined) {
        if (editor.getText().length > 0 || editor.getHTML() !== '<p></p>') {
            editor.commands.clearContent(true); 
        }
        return;
    }
    const currentContent = editor.getJSON();
    if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
        editor.commands.setContent(content, false, { preserveCursor: true });
    }
  }, [editor, content]);

  if (!editor) {
    return <div className="p-3 border rounded text-gray-500">에디터 로딩 중...</div>;
  }
  
  return (
    <div className={`editor-container border rounded ${className}`}>
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[200px] sm:min-h-[300px]"/>
    </div>
  );
};

export default TiptapEditor;