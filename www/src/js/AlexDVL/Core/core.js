var AlexDVL = {};

AlexDVL.initClass = function(cls, baseClass, name)
{
    if (baseClass)
    {
        cls.prototype = Object.create(baseCls.prototype);
        cls.prototype.constructor = cls;
        cls.base = baseCls.prototype;
        cls.baseCls = baseCls;
    }
    cls._Name = name;
};

AlexDVL.Object = function (settings)
{
    var inc = AlexDVL.Object._idInc++;
    var typeName = this.getTypeName();
    this._Id = typeName + inc;
};

AlexDVL.initClass(AlexDVL.Object, null, 'AlexDVL.Object');
AlexDVL.Object._idInc = 0;
var ObjProto = AlexDVL.Object.prototype;

ObjProto.getTypeName = function (full)
{
    var name = this.constructor._Name;
    if (full)
        return name;
    var arr = name.split('.');
    return arr[arr.length - 1];
};