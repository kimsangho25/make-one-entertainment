// src/components/CommandList.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// 아이콘 import (lucide-react가 설치되어 있다고 가정)
import { Heading1, List, ListOrdered, ChevronRight, Palette, Highlighter, XCircle } from 'lucide-react';

const getIcon = (title) => {
    switch (title) {
        case '제목 1': return <Heading1 size={18} className="mr-2" />;
        case '제목 2': return <Heading1 size={18} className="mr-2" />;
        case '글머리 목록': return <List size={18} className="mr-2" />;
        case '번호 목록': return <ListOrdered size={18} className="mr-2" />;
        // 🚨 새로운 명령 아이콘 추가
        case '텍스트 빨간색': return <Palette size={18} className="mr-2 text-red-500" />;
        case '텍스트 초기화': return <XCircle size={18} className="mr-2" />;
        case '하이라이트 노란색': return <Highlighter size={18} className="mr-2 text-yellow-500" />;
        case '하이라이트 해제': return <Highlighter size={18} className="mr-2" />;
        default: return <ChevronRight size={18} className="mr-2" />;
    }
};

const CommandList = forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index) => {
        const item = props.items[index];
        if (item) {
            // 🚨 최종 수정: Tiptap Suggestion이 전달하는 props 객체를 command 함수에 전달합니다.
            item.command(props); 
        }
    };
    // 상위 컴포넌트(Tiptap)에서 키보드 이벤트를 호출할 수 있게 노출
    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
                return true;
            }
            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % props.items.length);
                return true;
            }
            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }
            return false;
        },
    }));

    // 항목이 변경되면 선택 인덱스를 0으로 리셋
    useEffect(() => setSelectedIndex(0), [props.items]);

    return (
        <div className="bg-white border rounded-lg shadow-xl p-1 z-50">
            {props.items.length ? (
                props.items.map((item, index) => (
                    <button
                        className={`w-full flex items-center p-2 rounded-lg text-base mb-1 last:mb-0 ${index === selectedIndex ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                        key={item.title + index}
                        onClick={() => selectItem(index)}
                    >
                        {getIcon(item.title)}
                        {item.title}
                    </button>
                ))
            ) : (
                <div className="p-2 text-sm text-gray-500">일치하는 명령이 없습니다.</div>
            )}
        </div>
    );
});

export default CommandList;