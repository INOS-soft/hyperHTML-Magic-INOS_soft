import majinbuu from 'https://unpkg.com/majinbuu@latest/esm/main.js';

function Aura(node, childNodes) {
  this.node = node;
  this.childNodes = childNodes;
  childNodes.become = become;
  return majinbuu.aura(this, childNodes);
}

Aura.MAX_LIST_SIZE = 999;

Aura.prototype.splice = function splice() {
  const ph = this.node;
  const cn = this.childNodes;
  const target = cn[arguments[0] + (arguments[1] || 0)] || ph;
  const result = cn.splice.apply(cn, arguments);
  const pn = ph.parentNode;
  const doc = pn.ownerDocument;
  for (let tmp, i = 0, length = result.length; i < length; i++) {
    tmp = result[i];
    if (cn.indexOf(tmp) < 0) {
      pn.removeChild(tmp);
    }
  }
  for (let tmp, i = 2, length = arguments.length; i < length; pn.insertBefore(tmp, target)) {
    if ((length - i) === 1) {
      tmp = arguments[i++];
    } else {
      tmp = doc.createDocumentFragment();
      while (i < length) {
        tmp.appendChild(arguments[i++]);
      }
    }
  }
  return result;
};

function become(value) {
  let i = 0, length = this.length;
  if (value.length !== length) {
    majinbuu(this, value, Aura.MAX_LIST_SIZE);
  } else {
    for (; i < length--; i++) {
      if (this[length] !== value[length] || this[i] !== value[i]) {
        majinbuu(this, value, Aura.MAX_LIST_SIZE);
        return;
      }
    }
  }
}

export default Aura;