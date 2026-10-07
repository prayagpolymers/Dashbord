const API_URL="https://script.google.com/macros/s/AKfycbx8o2MxMrGr1wy9f7Z-v_P4cNswaT8wduyFio4FP1KUO8G7DDZj4Ay9kP25B6dguYdA/exec";
let data=null,charts={};
const $=id=>document.getElementById(id),M=x=>"₹"+(Number(x)||0).toLocaleString("en-IN",{maximumFractionDigits:0}),E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function api(action,params={}){
  let u=new URL(API_URL);u.searchParams.set("action",action);
  Object.entries(params).forEach(([k,v])=>{if(v&&v!=="ALL")u.searchParams.set(k,v)});
  const r=await fetch(u,{cache:"no-store"});
  const txt=await r.text();
  let j; try{j=JSON.parse(txt)}catch(e){throw Error("API did not return JSON. Check Apps Script deployment.")};
  if(!j.ok)throw Error(j.error||"API error");
  return j;
}
function opts(id,a){$(id).innerHTML='<option>ALL</option>'+a.map(x=>`<option>${E(x)}</option>`).join("")}
function chart(id,type,labels,values){if(charts[id])charts[id].destroy();charts[id]=new Chart($(id),{type,data:{labels,datasets:[{label:"Sales",data:values,borderWidth:1}]},options:{responsive:true,maintainAspectRatio:false}})}
function params(){return {sh:$("sh").value,state:$("state").value,group:$("group").value,fy:$("fy").value,month:$("month").value,party:$("party").value}}
function applyLists(j){if(!j||!j.lists)return;opts("sh",j.lists.sh);opts("party",j.lists.party);opts("state",j.lists.state);opts("group",j.lists.group);opts("fy",j.lists.fy);opts("month",j.lists.month)}
async function load(){
  $("status").textContent="Loading data…";
  $("errorBox").classList.add("hide");
  try{
    data=await api("summary",params());
    applyLists(data);
    const k=data.kpi||{};
    Object.keys(k).forEach(x=>{if($(x))$(x).textContent=M(k[x])});
    $("openingNote").textContent=data.openingFound?("Opening Balance • "+data.openingAsOn.split("-").reverse().join("-")):"Opening Balance tab not found";
    render(data);
    $("status").textContent="● LIVE DATA";
  }catch(e){
    $("status").textContent="API connection error";
    $("errorBox").classList.remove("hide");
    $("errorBox").innerHTML="API connection failed: "+E(e.message)+" &nbsp; <button onclick='load()'>Retry</button>";
    console.error(e);
  }
}
function render(d){
  chart("heads","bar",Object.keys(d.heads||{}).slice(0,15),Object.values(d.heads||{}).slice(0,15));
  chart("states","bar",Object.keys(d.states||{}).slice(0,15),Object.values(d.states||{}).slice(0,15));
  chart("groups","doughnut",Object.keys(d.groups||{}).slice(0,12),Object.values(d.groups||{}).slice(0,12));
  chart("months","bar",Object.keys(d.months||{}),Object.values(d.months||{}));
  $("partyRows").innerHTML=(d.party||[]).map(x=>`<tr>
    <td class="link" onclick='party(${JSON.stringify(x.party)})'>${E(x.party)}</td>
    <td>${E(x.sh)}</td><td>${E(x.state)}</td>
    <td>${M(x.opening)}</td><td>${M(x.sales)}</td><td>${M(x.payment)}</td>
    <td><b>${M(x.outstanding)}</b></td>
  </tr>`).join("");
}
async function party(p){
  $("mt").textContent=p;$("mb").innerHTML="Loading party details…";$("modal").classList.remove("hide");
  try{
    let j=await api("party",{party:p});
    $("mb").innerHTML=`<div class="miniCards">
      <div><small>Opening 01-04-2026</small><strong>${M(j.openingBalance)}</strong></div>
      <div><small>FY Sales</small><strong>${M(j.ledger.sales)}</strong></div>
      <div><small>Payment</small><strong>${M(j.ledger.payment)}</strong></div>
      <div><small>CN</small><strong>${M(j.ledger.cn)}</strong></div>
      <div><small>DN</small><strong>${M(j.ledger.dn)}</strong></div>
      <div><small>Sales Return</small><strong>${M(j.ledger.return)}</strong></div>
      <div><small>Outstanding</small><strong>${M(j.outstanding)}</strong></div>
    </div>
    <table><thead><tr><th>Date</th><th>Invoice</th><th>Item Code</th><th>Group</th><th>Qty</th><th>Rate</th><th>Taxable</th><th>Total</th></tr></thead>
    <tbody>${j.rows.map(x=>`<tr><td>${E(x.date)}</td><td class="link" onclick='invoice(${JSON.stringify(x.invoice)},${JSON.stringify(p)})'>${E(x.invoice)}</td><td>${E(x.code)}</td><td>${E(x.group)}</td><td>${x.qty}</td><td>${M(x.rate)}</td><td>${M(x.taxable)}</td><td>${M(x.total)}</td></tr>`).join("")}</tbody></table>`;
  }catch(e){$("mb").innerHTML=`<div class="error">${E(e.message)}</div>`}
}
async function invoice(inv,p){
  $("mt").textContent="Invoice "+inv;$("mb").innerHTML="Loading invoice…";
  try{
    let j=await api("invoice",{party:p,invoice:inv});
    $("mb").innerHTML=`<h3>${E(p)}</h3><table><thead><tr><th>Date</th><th>Item Code</th><th>Group</th><th>Qty</th><th>Sale Rate</th><th>Taxable</th><th>GST 18%</th><th>Total</th></tr></thead><tbody>${j.rows.map(x=>`<tr><td>${E(x.date)}</td><td>${E(x.code)}</td><td>${E(x.group)}</td><td>${x.qty}</td><td>${M(x.rate)}</td><td>${M(x.taxable)}</td><td>${M(x.gst)}</td><td>${M(x.total)}</td></tr>`).join("")}</tbody></table>`;
  }catch(e){$("mb").innerHTML=`<div class="error">${E(e.message)}</div>`}
}
$("apply").onclick=load;
$("close").onclick=()=>$("modal").classList.add("hide");
$("modal").onclick=e=>{if(e.target.id==="modal")$("modal").classList.add("hide")};
async function start(){
  $("status").textContent="Checking API…";
  try{
    const h=await api("health");
    if(!h.ok)throw Error("Health check failed");
    await load();
  }catch(e){
    $("status").textContent="API connection error";
    $("errorBox").classList.remove("hide");
    $("errorBox").innerHTML="API connection failed: "+E(e.message)+" &nbsp; <button onclick='start()'>Retry</button>";
    console.error(e);
  }
}
start();
