import{d as m,G as i,r as f,c as s,e as r,Q as e,V as _,h as u,F as k,X as v,f as b,n as g,a3 as h,k as w}from"./CtBPwxmq.js";const x={key:1,class:"loaded"},B=["poster"],V=["src"],C=["src","type"],$=["autoplay","src"],N=m({__name:"VideoPlayer",props:{poster:{type:String,default:""},src:{type:String,default:""},sources:{type:Array,default:()=>[]},autoplay:{type:Boolean,default:!1}},setup(n){const o=n,a=i(()=>{if(o.src&&o.src.includes("youtube.com/watch")){const t=o.src.match(/\?v=([^&]*)/);return{name:"youtube",src:`https://www.youtube-nocookie.com/embed/${(t==null?void 0:t[1])||""}?autoplay=1`,poster:o.poster||`https://i3.ytimg.com/vi/${(t==null?void 0:t[1])||""}/hqdefault.jpg`}}}),p=f(!1);if(!o.src&&!o.sources.length)throw new Error("VideoPlayer: you need to provide either `src` or `sources` props");const d=i(()=>{var t,c;return o.src||((c=(t=o.sources)==null?void 0:t[0])==null?void 0:c.src)||!1});return(t,c)=>{const y=h;return s(),r("div",{class:g(["video-player",{loaded:e(p)}])},[(e(a)?e(a).poster:n.poster)?(s(),_(y,{key:0,src:e(a)?e(a).poster:n.poster},null,8,["src"])):u("",!0),e(p)?(s(),r("div",x,[e(a)?e(a).name==="youtube"?(s(),r("iframe",{key:1,allow:"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:"true",autoplay:n.autoplay,src:e(a).src},null,8,$)):u("",!0):(s(),r("video",{key:0,poster:n.poster,controls:"",autoplay:""},[e(d)?(s(),r("source",{key:0,src:e(d)},null,8,V)):u("",!0),(s(!0),r(k,null,v(n.sources,l=>(s(),r("source",{key:l.src||l,src:l.src||l,type:l.type},null,8,C))),128))],8,B))])):u("",!0),e(p)?u("",!0):(s(),r("div",{key:2,class:"play-button",onClick:c[0]||(c[0]=l=>p.value=!0)},c[1]||(c[1]=[b("button",null,null,-1)])))],2)}}}),F=w(N,[["__scopeId","data-v-578f2cdb"]]);export{F as default};
