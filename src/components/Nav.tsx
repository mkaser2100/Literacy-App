import{Home,Map,Gift,BarChart3}from'lucide-react';
export default function Nav({page,setPage}:{page:string;setPage:(p:string)=>void}){
  const items=[['home',Home,'Home'],['journey',Map,'Learn'],['rewards',Gift,'Rewards'],['progress',BarChart3,'More']] as const;
  return <nav className="nav" aria-label="Primary navigation">{items.map(([id,Icon,label])=>
    <button key={id} className={page===id?'active':''} onClick={()=>setPage(id)}>
      <span className="nav-icon"><Icon size={22}/></span><span>{label}</span>
    </button>)}</nav>
}
