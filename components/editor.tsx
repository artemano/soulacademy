"use client";

import ReactQuill from "react-quill";
import React from "react";
import "react-quill/dist/quill.snow.css";
import "./editor.module.css";

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}
interface EditorState {
    isWindowLoaded: boolean;
}

const Quill = ReactQuill.Quill
const Font = Quill.import('attributors/class/font');

Font.whitelist = ['ubuntu', 'raleway', 'roboto', 'barlow'];
Quill.register(Font, true);
;
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);


export class Editor extends React.Component<EditorProps, EditorState> {
    private reactQuillRef;
    static modules = {
        toolbar: [
            [{ header: [] }],
            [{ font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            ['clean']
        ]
    }
    static formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link',
    ]
    constructor(props: EditorProps, state: EditorState) {
        super(props);
        this.reactQuillRef = React.createRef();
        this.state = { isWindowLoaded: false };

    }
    componentDidMount(): void {
        this.setState({ ...this.state, isWindowLoaded: true });
    }
    render() {
        return (
            <div className="w-full bg-white" >
                <p>{this.state.isWindowLoaded}</p>
                {
                    this.state.isWindowLoaded && <ReactQuill theme="snow" {...this.props} modules={Editor.modules} formats={Editor.formats} />
                }
            </div>
        )
    }
} 
