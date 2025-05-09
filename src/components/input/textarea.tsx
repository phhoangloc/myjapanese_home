/* eslint-disable @typescript-eslint/no-explicit-any */
import { AtomicBlockUtils, CompositeDecorator, Editor, EditorState, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import React, { useEffect, useRef, useState } from 'react'
import ImageIcon from '@mui/icons-material/Image';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
type Props = {
    value: string,
    onchange: (v: string) => void
}
const Image = (props: any) => {
    const { src } = props.contentState.getEntity(props.entityKey).getData();
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className='w-full' />;
};
const decorator = new CompositeDecorator([
    {
        strategy: (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges((character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null && contentState.getEntity(entityKey).getType() === 'IMAGE'
                );
            }, callback);
        },
        component: Image,
    },
]);

const TextArea = ({ value, onchange }: Props) => {

    const [_outPut, set_outPut] = useState<string>("")
    const [_type, set_type] = useState<string>("")
    const [_editorState, set_EditorState] = useState(EditorState.createEmpty(decorator));

    useEffect(() => {
        const _stateContent = stateFromHTML(value)
        set_EditorState(EditorState.createWithContent(_stateContent, decorator))
    }, [value])

    useEffect(() => {
        const _stateContent = _editorState.getCurrentContent()
        const _content = stateToHTML(_stateContent, {
            blockStyleFn: (block) => {
                const type = block.getType();
                if (type === 'text-center') {
                    return {
                        attributes: { class: 'text-center' },
                    };
                }
                if (type === 'text-right') {
                    return {
                        attributes: { class: 'text-right' },
                    };
                }
            },
        })
        set_outPut(_content)
    }, [_editorState])

    useEffect(() => {
        onchange(_outPut)
    }, [_outPut, onchange])

    const createBlockStyle = (value: EditorState, type: string) => {
        set_EditorState(RichUtils.toggleBlockType(value, type));
        set_type(_type => _type === type ? "" : type)
    }

    const createImage = async (value: EditorState) => {
        const selection = value.getSelection();
        const content = value.getCurrentContent();
        const startOffset = selection.getStartOffset();
        const endOffset = selection.getEndOffset();
        const block = content.getBlockForKey(selection.getStartKey());
        const text = block.getText()
        const contentStateWithEntity = content.createEntity('IMAGE', 'MUTABLE', { src: text.slice(startOffset, endOffset) });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(value, entityKey, ' ');
        set_EditorState(newEditorState);
    }

    const makeTextRight = async (value: EditorState) => {
        set_EditorState(RichUtils.toggleBlockType(value, 'text-right'));
        set_type(type => type !== 'text-right' ? 'text-right' : "")
    }
    const makeTextCenter = async (value: EditorState) => {
        set_EditorState(RichUtils.toggleBlockType(value, 'text-center'));
        set_type(type => type !== 'text-center' ? "text-center" : "")
    }

    const editRef: any = useRef("")

    const tool = [
        {
            name: "h1",
            func: () => createBlockStyle(_editorState, "header-one"),
            type: "header-one",
        },
        {
            name: "h2",
            func: () => createBlockStyle(_editorState, "header-two"),
            type: "header-two",
        },
        {
            name: "h3",
            func: () => createBlockStyle(_editorState, "header-three"),
            type: "header-three",
        },
        {
            name: "h4",
            func: () => createBlockStyle(_editorState, "header-four"),
            type: "header-four",
        },
        {
            name: "h5",
            func: () => createBlockStyle(_editorState, "header-five"),
            type: "header-five",
        },
        {
            name: "p",
            func: () => createBlockStyle(_editorState, "paragraph"),
            type: "paragraph",
        },
        {
            name: "</>",
            func: () => createBlockStyle(_editorState, "code-block"),
            type: "code-block",
        },
        {
            name: <ImageIcon className='h-full m-auto' />,
            func: () => createImage(_editorState),
        },
        {
            name: <FormatAlignCenterIcon className='h-full m-auto' />,
            func: () => makeTextCenter(_editorState),
            type: "text-center",
        },
        {
            name: <FormatAlignRightIcon className='h-full m-auto' />,
            func: () => makeTextRight(_editorState),
            type: "text-right",
        },
    ]
    function myBlockStyleFn(contentBlock: { getType: () => any; }) {
        const type = contentBlock.getType();
        if (type === 'text-center') {
            return 'text-center';
        }
        if (type === 'text-right') {
            return 'text-right';
        }
        return '';
    }
    return (
        <div className=' rounded'>
            <div className='sticky top-0 h-12 py-1 flex gap-1 z-[1]'>
                {
                    tool.map((tl, index) =>
                        <div key={index} className={`h-full aspect-square flex flex-col justify-center text-center border border-slate-300  rounded text-sm cursor-pointer ${_type === tl.type ? "bg-sky-600 text-white" : "bg-white"} `} onClick={tl.func}>{tl.name}</div>
                    )
                }
            </div>
            <div className='dangerous_box border bg-white border-slate-300 min-h-96 p-4 overflow-x-auto scroll_none cursor-text' onClick={() => editRef.current.focus()}>
                <Editor ref={editRef} editorState={_editorState} onChange={(editorState) => set_EditorState(editorState)} blockStyleFn={myBlockStyleFn} />
            </div>
        </div>
    )
}

export default TextArea