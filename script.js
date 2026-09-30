const PLACES=["学校","プール","ホテル","コンビニ","子供部屋","廊下","駅","公園","ショッピングモール","地下通路","病院","体育館","遊園地","海","屋上","駐車場","無人の街"];
const CONDS=[
["誰もいない","誰もいない{P}に、{O}がぽつんとある。"],
["水没している","水に沈んだ{P}の底に、{O}が揺れている。"],
["逆さま","逆さまになった{P}に、{O}が静かに佇んでいる。"],
["巨大になっている","{P}の真ん中に、巨大な{O}がある。"],
["夜","夜の{P}に、{O}が淡く光っている。"],
["空に浮いている","空に浮かぶ{P}に、{O}が置かれている。"],
["時間が止まっている","時間の止まった{P}に、{O}だけが残っている。"],
["全部青い","すべてが青い{P}に、{O}がある。"],
["霧が出ている","霧の立ちこめる{P}に、{O}がぼんやり見える。"],
["出口がない","出口のない{P}に、{O}が置かれている。"],
["何も音がしない","音のしない{P}に、{O}がある。"],
["昼なのに暗い","昼なのに暗い{P}に、{O}が浮かんでいる。"],
["雨が降っている","雨の降る{P}に、{O}がある。"],
["昔の姿になっている","昔の姿に戻った{P}に、{O}がある。"],
["少しだけ壊れている","少しだけ壊れた{P}に、{O}がある。"]];
const OBJS=["月","ぬいぐるみ","電話","テレビ","自動販売機","風船","鏡","時計","鍵","雲","水槽","階段","傘","ベッド","花","古いパソコン","星"];
// 固定お題 + 夢の中にしかない場所
const FIXED=[
["誰もいない学校。","学校","誰もいない","—"],
["青いカーペットのホテルの、終わらない廊下。","ホテル","終わらない","カーペット"],
["深夜の無人駅に、電話が鳴っている。","駅","夜","電話"],
["空っぽのショッピングモールで、噴水だけが動いている。","ショッピングモール","誰もいない","噴水"],
["子供の頃の部屋。けれど、窓の外が知らない街。","子供部屋","昔の姿","窓"],
["夕方の公園に、ブランコだけが揺れ続けている。","公園","夕方","ブランコ"],
["古いコンビニの奥に、もうひとつ店がある。","コンビニ","少しだけ壊れている","扉"],
["【夢だけの場所】階段を降りるたび、部屋が増えていく家。","夢の中の場所","増殖","階段"],
["【夢だけの場所】屋上のさらに上にある、屋上。","夢の中の場所","出口がない","空"],
["【夢だけの場所】どこまでも続く、青いプールの更衣室。","夢の中の場所","全部青い","ロッカー"]];
const OPEN=["本日の夢はこちらです。","夢のご案内を始めます。","お待たせいたしました。今日の夢です。"];
const CLOSE=["どうぞ、足元にお気をつけください。","ご案内は以上です。いってらっしゃいませ。","出口はたぶん、ありません。","目が覚めるまで、ごゆっくり。"];
const $=id=>document.getElementById(id);
const pick=a=>a[Math.floor(Math.random()*a.length)];
let st={log:[],n:0};
try{const s=JSON.parse(localStorage.getItem("dreamguide")||"null");if(s&&Array.isArray(s.log))st=s}catch(e){}
function save(){try{localStorage.setItem("dreamguide",JSON.stringify(st))}catch(e){}}
function gen(){
  if(Math.random()<.25){const f=pick(FIXED);return{key:f[0],t:f[0],p:f[1],c:f[2],o:f[3]}}
  const p=pick(PLACES),c=pick(CONDS),o=pick(OBJS);
  return{key:p+c[0]+o,t:c[1].replace("{P}",p).replace("{O}",o),p:p,c:c[0],o:o};
}
function tooSimilar(d){
  const L=st.log;
  if(L.some(x=>x.key===d.key))return true;                 // 同じ組み合わせ
  if(L[0]&&(L[0].p===d.p||L[0].c===d.c||L[0].o===d.o))return true; // 直前と要素が被る
  if(L.slice(0,3).some(x=>x.o===d.o&&x.o!=="—"))return true;       // 似た組み合わせ
  return false;
}
function renderLog(){
  const ul=$("log");if(!st.log.length)return;
  ul.innerHTML="";
  st.log.forEach(x=>{const li=document.createElement("li");const b=document.createElement("b");b.textContent="DREAM "+String(x.no).padStart(2,"0");li.appendChild(b);li.appendChild(document.createTextNode(x.t));ul.appendChild(li)});
}
function dream(){
  let d,i=0;do{d=gen();i++}while(tooSimilar(d)&&i<40);
  st.n++;d.no=st.n;
  st.log.unshift(d);st.log=st.log.slice(0,10);save();
  $("no").textContent="DREAM "+String(d.no).padStart(2,"0");
  $("g1").textContent=pick(OPEN);$("txt").textContent=d.t;$("g2").textContent=pick(CLOSE);
  $("lp").textContent=d.p;$("lc").textContent=d.c;$("lo").textContent=d.o;
  const msg="🌙 DREAM GUIDE\n\n「"+d.t+"」\n\n#DREAMGUIDE";
  let u="";try{u=location.href.split("#")[0];if(!/^https?:/.test(u))u=""}catch(e){}
  $("share").href="https://twitter.com/intent/tweet?text="+encodeURIComponent(msg)+(u?"&url="+encodeURIComponent(u):"");
  const r=$("res");r.classList.remove("hide","in");void r.offsetWidth;r.classList.add("in");
  r.scrollIntoView({behavior:"smooth",block:"start"});
  renderLog();
}
$("dream").addEventListener("click",dream);
$("again").addEventListener("click",dream);
renderLog();
