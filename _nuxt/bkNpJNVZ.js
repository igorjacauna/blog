import{d as _,r as i,x as k,c as s,e as p,f,i as C,w,V as m,Q as y,T as $,n as v,$ as x,k as g,t as b,h as S,a8 as V}from"./CtBPwxmq.js";import{b as z,o as I}from"./CiKT5PfT.js";const N={class:"icon-wrapper"},P=_({__name:"ProseCodeCopyButton",props:{content:{type:String,default:""},show:{type:Boolean,default:!1}},setup(e){const n=e,a=i(),{copy:t}=z();I(a,()=>{o.value==="copied"&&(o.value="init")});const{prose:c}=k(),o=i("init"),h=B=>{t(n.content).then(()=>{o.value="copied"}).catch(l=>{console.warn("Couldn't copy to clipboard!",l)})};return(B,l)=>{const r=x;return s(),p("button",{ref_key:"copyButtonRef",ref:a,class:v([(e.show||o.value==="copied")&&"show"]),onClick:h},[l[0]||(l[0]=f("span",{class:"sr-only"},"Copy to clipboard",-1)),f("span",N,[C($,{name:"fade"},{default:w(()=>{var u,d;return[o.value==="copied"?(s(),m(r,{key:0,name:(u=y(c).copyButton)==null?void 0:u.iconCopied,size:"18",class:"copied"},null,8,["name"])):(s(),m(r,{key:1,name:(d=y(c).copyButton)==null?void 0:d.iconCopy,size:"18"},null,8,["name"]))]}),_:1})])],2)}}}),T=g(P,[["__scopeId","data-v-973210f4"]]),A={key:0,class:"filename"},M=_({__name:"ProseCode",props:{code:{type:String,default:""},language:{type:String,default:null},filename:{type:String,default:null},highlights:{type:Array,default:()=>[]}},setup(e){const n=i(!1);return(a,t)=>{const c=T;return s(),p("div",{class:v([[`highlight-${e.language}`],"prose-code"]),onMouseenter:t[0]||(t[0]=o=>n.value=!0),onMouseleave:t[1]||(t[1]=o=>n.value=!1)},[e.filename?(s(),p("span",A,b(e.filename),1)):S("",!0),V(a.$slots,"default",{},void 0,!0),C(c,{show:n.value,content:e.code,class:"copy-button"},null,8,["show","content"])],34)}}}),E=g(M,[["__scopeId","data-v-dc7445f6"]]);export{E as default};
