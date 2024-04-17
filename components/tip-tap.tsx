"use client";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/react";
import TextAlign from '@tiptap/extension-text-align'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import FontSize from 'tiptap-extension-font-size';
import Paragraph from '@tiptap/extension-paragraph'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import Text from '@tiptap/extension-text'
import { BackColor } from "@/lib/tiptap/back-color"
import { EditorContent } from "@tiptap/react";

import {
    Bold,
    Strikethrough,
    Italic,
    ListOrdered,
    List,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Quote,
    Heading5,
    Heading6,
    AlignLeft,
    AlignRight,
    AlignCenter,
    Highlighter,
    AlignJustify,
    PiSquare
} from "lucide-react";
import { Toggle } from "./ui/toggle";

interface EditorProps {
    onChange?: (value: string) => void;
    value: string;
    readonly?: boolean;
    className?: string;
}
interface EditorState {
    isWindowLoaded: boolean;
    content: string;
}
import styles from "./tiptap.module.scss";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ColorPicker } from "./color-picker";
import TextStyle from '@tiptap/extension-text-style';
import { Separator } from "@radix-ui/react-separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


export class TipTap extends React.Component<EditorProps, EditorState> {
    private editorRef;
    private editor: Editor | null = null;
    static config = {
        extensions: [
            Document,
            Highlight,
            FontSize,
            Color.configure({ types: ["textStyle"] }),
            Heading.configure({ levels: [1, 2, 3, 4,] }),
            Paragraph,
            Text,
            TextStyle,
            BackColor.configure({ types: ["textStyle"] }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            StarterKit.configure({
                document: false,
                heading: false,
                text: false,
                paragraph: false,
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                },
            }),
        ],
    }
    constructor(props: EditorProps, state: EditorState) {
        super(props);
        this.editorRef = React.createRef();
        this.state = { isWindowLoaded: false, content: props.value, };
        if (!props.readonly) {
            this.editor = new Editor({ ...TipTap.config, content: this.state.content, onUpdate: ({ editor }) => { props.onChange!(editor.getHTML()) } })
            this.editor.setOptions({
                editorProps: {
                    attributes: {
                        class: cn("rounded-md border h-[265px] overflow-y-scroll  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 no-scrollbar", styles.tiptap)
                    },
                },
            })
        } else {
            this.editor = new Editor({ ...TipTap.config, content: this.state.content })
            this.editor.setEditable(false);
            this.editor.setOptions({
                editorProps: {
                    attributes: {
                        class: cn(styles.tiptap, this.props.className ?? "")
                    },
                },
            })
        }

    }

    public onUpdateData({ data }: { data: any }) {
        if (this.editor) {
            const content = this.editor.getHTML();
            if (!this.props.readonly) this.props.onChange!(content);
            console.log(content)
        }
    }

    componentDidMount(): void {
        this.setState({ ...this.state, isWindowLoaded: true });
    }


    render() {
        return (
            <div className={cn("flex flex-col justify-stretch", this.props.readonly ? "h-[100px]" : "", this.props.className ?? "")}>
                {this.state.isWindowLoaded && (
                    <div className="flex flex-col gap-y-1">
                        {

                            !this.props.readonly && (
                                <div>
                                    <ToolbarEditor editor={this.editor} />
                                </div>
                            )
                        }
                        <div className="flex-1 overflow-y-scroll no-scrollbar">
                            <EditorContent editor={this.editor} className="h-full" />
                        </div>

                    </div>
                )
                }
            </div>
        );
    }
}

type ToolbarEditorProps = {
    editor: Editor | null;
}
type Level = 1 | 2 | 3 | 4 | 5 | 6;

export const ToolbarEditor = ({ editor }: ToolbarEditorProps) => {
    const [color, setColor] = useState("#ff");
    const [background, setBackground] = useState("transparent");
    const [selectedValue, setSelectedValue] = useState("");

    if (!editor) return null;
    useEffect(() => {
        if (editor) {
            editor.on('selectionUpdate', ({ editor }) => {
                const attributes = editor.getAttributes('heading');
                console.log(attributes.level);
                if (editor.isActive('heading', { level: 1 })) {
                    setSelectedValue('h1');
                }
                if (editor.isActive('heading', { level: 2 })) {
                    setSelectedValue('h2');
                }
                if (editor.isActive('heading', { level: 3 })) {
                    setSelectedValue('h3');
                }
                if (editor.isActive('heading', { level: 4 })) {
                    setSelectedValue('h4');
                }
                if (editor!.isActive("paragraph")) setSelectedValue('p');
            });
        }
        return () => {
            editor.off('selectionUpdate');
        }
    }, [editor])



    const onChange = (heading: Level | string) => {
        if (heading === "Normal") {
            editor!.chain().focus().setParagraph().run();
        } else {
            editor.isActive("heading");
            editor!.chain().focus().toggleHeading({ level: heading as Level }).run()
        }
    }
    const onValueChange = (status: string) => {
        console.log(status);
        switch (status) {
            case 'h1':
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                break;
            case 'h2':
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                break;
            case 'h3':
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                break;
            case 'h3':
                editor.chain().focus().toggleHeading({ level: 4 }).run();
                break;
            case 'p':
                editor.chain().focus().setParagraph().run();
                break;
        }
        setSelectedValue(status);
    }

    const onHandleClick = (e: React.MouseEvent<HTMLButtonElement>, action: "left" | "right" | "center" | "justify") => {
        e.preventDefault();
        e.stopPropagation();
        editor.chain().focus().setTextAlign(action).run()
    }
    const setTextColor = (color: string) => {
        console.log(color);
        setColor(color);
        editor.chain().focus().setColor(color).run();
    }

    const setTexBackColor = (color: string) => {
        console.log(color);
        if (editor.isActive("textStyle", { backgroundColor: color })) {
            editor.chain().focus().unsetBackColor().run();
            setBackground("transparent");
            return;
        }
        setBackground(color);
        editor.chain().focus().setBackColor(color).run();
    }

    return (
        <div className="border border-input bg-transparent rounded-md flex flex-row flex-wrap gap-x-1 p-[3px]">
            <Select onValueChange={onValueChange} value={selectedValue}>
                <SelectTrigger className="w-[130px] h-[30px] m-1">
                    <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="h1"><div className="flex flex-row items-center"><Heading1 className="h-4 w-4" /><span className="pl-2">Heading 1</span></div></SelectItem>
                    <SelectItem value="h2"><div className="flex flex-row items-center"><Heading2 className="h-4 w-4" /><span className="pl-2">Heading 2</span></div></SelectItem>
                    <SelectItem value="h3"><div className="flex flex-row items-center"><Heading3 className="h-4 w-4" /><span className="pl-2">Heading 3</span></div></SelectItem>
                    <SelectItem value="h4"><div className="flex flex-row items-center"><Heading4 className="h-4 w-4" /><span className="pl-2">Heading 4</span></div></SelectItem>
                    <SelectItem value="p"><div className="flex flex-row items-center"><PiSquare className="h-4 w-4" /><span className="pl-2">Paragraph</span></div></SelectItem>
                </SelectContent>
            </Select>
            <Toggle className="data-[state=on]:bg-slate-200 data-[state=on]:text-accent-foreground" size="default" variant="outline" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle className="data-[state=on]:bg-slate-200 data-[state=on]:text-accent-foreground" size="default" variant="outline" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle className="data-[state=on]:bg-slate-200 data-[state=on]:text-accent-foreground" size="default" variant="outline" pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
                <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Toggle className="data-[state=on]:bg-slate-200 data-[state=on]:text-accent-foreground" size="default" variant="outline" pressed={editor.isActive("blockQuote")} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote className="h-4 w-4" />
            </Toggle>
            <Toggle className="data-[state=on]:bg-slate-200 data-[state=on]:text-accent-foreground" size="default" variant="outline" pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle className="data-[state=on]:bg-slate-200 data-[state=on]:text-accent-foreground" size="default" variant="outline" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="h-4 w-4" />
            </Toggle>
            <Button size="default" variant="outline" onClick={(e) => onHandleClick(e, "left")}>
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button size="default" variant="outline" onClick={(e) => onHandleClick(e, "right")}>
                <AlignRight className="h-4 w-4" />
            </Button>
            <Button size="default" variant="outline" onClick={(e) => onHandleClick(e, "center")}>
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button size="default" variant="outline" onClick={(e) => onHandleClick(e, "justify")}>
                <AlignJustify className="h-4 w-4" />
            </Button>
            <ColorPicker background={color} setBackground={setTextColor} />
            <ColorPicker background={background} setBackground={setTexBackColor} isBack />
            <Toggle className="data-[state=on]:bg-slate-200 data-[state=on]:text-accent-foreground" size="default" variant="outline" pressed={editor.isActive("highlight")} onPressedChange={() => editor.chain().focus().toggleHighlight().run()}>
                <Highlighter className="h-4 w-4" />
            </Toggle>

        </div>
    )
}