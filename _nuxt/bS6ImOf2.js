import{d as m,a0 as d,x,G as a,c as _,e as f,a4 as z,k as S}from"./CtBPwxmq.js";const I=m({__name:"IconCSS",props:{name:{type:String,required:!0},size:{type:String,default:""}},setup(u){var c;d(n=>({"54d46a80":p.value}));const e=x();(c=e==null?void 0:e.nuxtIcon)!=null&&c.aliases;const s=u,l=a(()=>{var n;return(((n=e==null?void 0:e.nuxtIcon)==null?void 0:n.aliases)||{})[s.name]||s.name}),p=a(()=>`url('https://api.iconify.design/${l.value.replace(":","/")}.svg')`),o=a(()=>{var t,r,i;if(!s.size&&typeof((t=e.nuxtIcon)==null?void 0:t.size)=="boolean"&&!((r=e.nuxtIcon)!=null&&r.size))return;const n=s.size||((i=e.nuxtIcon)==null?void 0:i.size)||"1em";return String(Number(n))===n?`${n}px`:n});return(n,t)=>(_(),f("span",{style:z({width:o.value,height:o.value})},null,4))}}),y=S(I,[["__scopeId","data-v-9b51e46b"]]);export{y as default};
