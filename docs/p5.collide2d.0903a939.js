parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"RmBk":[function(require,module,exports) {
console.log("### p5.collide ###"),p5.prototype._collideDebug=!1,p5.prototype.collideDebug=function(t){_collideDebug=t},p5.prototype.collideRectRect=function(t,i,e,o,l,n,r,c){return t+e>=l&&t<=l+r&&i+o>=n&&i<=n+c},p5.prototype.collideRectCircle=function(t,i,e,o,l,n,r){var c=l,p=n;return l<t?c=t:l>t+e&&(c=t+e),n<i?p=i:n>i+o&&(p=i+o),this.dist(l,n,c,p)<=r/2},p5.prototype.collideCircleCircle=function(t,i,e,o,l,n){return this.dist(t,i,o,l)<=e/2+n/2},p5.prototype.collidePointCircle=function(t,i,e,o,l){return this.dist(t,i,e,o)<=l/2},p5.prototype.collidePointEllipse=function(t,i,e,o,l,n){var r=l/2,c=n/2;if(t>e+r||t<e-r||i>o+c||i<o-c)return!1;var p=t-e,s=i-o,u=c*this.sqrt(this.abs(r*r-p*p))/r;return s<=u&&s>=-u},p5.prototype.collidePointRect=function(t,i,e,o,l,n){return t>=e&&t<=e+l&&i>=o&&i<=o+n},p5.prototype.collidePointLine=function(t,i,e,o,l,n,r){var c=this.dist(t,i,e,o),p=this.dist(t,i,l,n),s=this.dist(e,o,l,n);return void 0===r&&(r=.1),c+p>=s-r&&c+p<=s+r},p5.prototype.collideLineCircle=function(t,i,e,o,l,n,r){var c=this.collidePointCircle(t,i,l,n,r),p=this.collidePointCircle(e,o,l,n,r);if(c||p)return!0;var s=t-e,u=i-o,d=this.sqrt(s*s+u*u),h=((l-t)*(e-t)+(n-i)*(o-i))/this.pow(d,2),y=t+h*(e-t),f=i+h*(o-i);return!!this.collidePointLine(y,f,t,i,e,o)&&(this._collideDebug&&this.ellipse(y,f,10,10),s=y-l,u=f-n,this.sqrt(s*s+u*u)<=r/2)},p5.prototype.collideLineLine=function(t,i,e,o,l,n,r,c,p){var s=((r-l)*(i-n)-(c-n)*(t-l))/((c-n)*(e-t)-(r-l)*(o-i)),u=((e-t)*(i-n)-(o-i)*(t-l))/((c-n)*(e-t)-(r-l)*(o-i));if(s>=0&&s<=1&&u>=0&&u<=1){if(this._collideDebug||p)var d=t+s*(e-t),h=i+s*(o-i);return this._collideDebug&&this.ellipse(d,h,10,10),!p||{x:d,y:h}}return!!p&&{x:!1,y:!1}},p5.prototype.collideLineRect=function(t,i,e,o,l,n,r,c,p){var s,u,d,h,y;return p?y={left:s=this.collideLineLine(t,i,e,o,l,n,l,n+c,!0),right:u=this.collideLineLine(t,i,e,o,l+r,n,l+r,n+c,!0),top:d=this.collideLineLine(t,i,e,o,l,n,l+r,n,!0),bottom:h=this.collideLineLine(t,i,e,o,l,n+c,l+r,n+c,!0)}:(s=this.collideLineLine(t,i,e,o,l,n,l,n+c),u=this.collideLineLine(t,i,e,o,l+r,n,l+r,n+c),d=this.collideLineLine(t,i,e,o,l,n,l+r,n),h=this.collideLineLine(t,i,e,o,l,n+c,l+r,n+c)),!!(s||u||d||h)&&(!p||y)},p5.prototype.collidePointPoly=function(t,i,e){for(var o=!1,l=0,n=0;n<e.length;n++){(l=n+1)==e.length&&(l=0);var r=e[n],c=e[l];(r.y>i&&c.y<i||r.y<i&&c.y>i)&&t<(c.x-r.x)*(i-r.y)/(c.y-r.y)+r.x&&(o=!o)}return o},p5.prototype.collideCirclePoly=function(t,i,e,o,l){null==l&&(l=!1);for(var n=0,r=0;r<o.length;r++){(n=r+1)==o.length&&(n=0);var c=o[r],p=o[n];if(this.collideLineCircle(c.x,c.y,p.x,p.y,t,i,e))return!0}if(1==l&&this.collidePointPoly(t,i,o))return!0;return!1},p5.prototype.collideRectPoly=function(t,i,e,o,l,n){null==n&&(n=!1);for(var r=0,c=0;c<l.length;c++){(r=c+1)==l.length&&(r=0);var p=l[c],s=l[r];if(this.collideLineRect(p.x,p.y,s.x,s.y,t,i,e,o))return!0;if(1==n)if(this.collidePointPoly(t,i,l))return!0}return!1},p5.prototype.collideLinePoly=function(t,i,e,o,l){for(var n=0,r=0;r<l.length;r++){(n=r+1)==l.length&&(n=0);var c=l[r].x,p=l[r].y,s=l[n].x,u=l[n].y;if(this.collideLineLine(t,i,e,o,c,p,s,u))return!0}return!1},p5.prototype.collidePolyPoly=function(t,i,e){null==e&&(e=!1);for(var o=0,l=0;l<t.length;l++){(o=l+1)==t.length&&(o=0);var n=t[l],r=t[o],c=this.collideLinePoly(n.x,n.y,r.x,r.y,i);if(c)return!0;if(1==e&&(c=this.collidePointPoly(i[0].x,i[0].y,t)))return!0}return!1},p5.prototype.collidePointTriangle=function(t,i,e,o,l,n,r,c){var p=this.abs((l-e)*(c-o)-(r-e)*(n-o));return this.abs((e-t)*(n-i)-(l-t)*(o-i))+this.abs((l-t)*(c-i)-(r-t)*(n-i))+this.abs((r-t)*(o-i)-(e-t)*(c-i))==p},p5.prototype.collidePointPoint=function(t,i,e,o,l){return null==l&&(l=0),this.dist(t,i,e,o)<=l},p5.prototype.collidePointArc=function(t,i,e,o,l,n,r,c){null==c&&(c=0);var p=this.createVector(t,i),s=this.createVector(e,o),u=this.createVector(l,0).rotate(n),d=p.copy().sub(s);if(p.dist(s)<=l+c){var h=u.dot(d),y=u.angleBetween(d);if(h>0&&y<=r/2&&y>=-r/2)return!0}return!1};
},{}]},{},["RmBk"], null)
//# sourceMappingURL=https://olgahwang.github.io/InsideBody_Game/p5.collide2d.0903a939.js.map