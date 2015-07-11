# NiceSlider
�������ƶ��˻������

Ŀǰ�������һЩ���Ƽ�ȱ�ݣ�

- IE8�����°汾��֧�֣�
- ����jQuery/Zepto��

## �÷�

����һ����Ԫ�أ�����Ҫ������ʾ�����ݷ��븸Ԫ���У����磺

```
<ul id="slider1">
  <li>item 1 </li>
  <li>item 2 </li>
  <li>item 3 </li>
</ul>
```

Ȼ����ڸ�Ԫ�ش������:

```
var slider = new NiceSlider('#slider1')
```

-------------------------------------

## ����

`new NiceSlider('#slider1', config)`

������ | ���� | Ĭ��ֵ | ˵��
---- | ---- | ---- | ----
unlimit | Boolean | true | �Ƿ�ʵ���޷�ѭ��
ctrlBtn | Boolean | true | �Ƿ�������ҿ��ư�ť
indexBtn | Boolean | true | �Ƿ��������Ԫ��
indexFormat | Function | - | �Զ�������Ԫ������
offset | Number | 0 | ƫ��ֵ
index | Number | 0 | ��ʼ��ʾ���
dir | String | 'h' | ��������
autoPlay | Boolean | false | �Զ�����
duration | Number | 5000 | �Զ����ż��ʱ��
bounce | Boolean | true | ���޷�ѭ��ʱ���Ƿ�֧�ֱ߽�ص�Ч��
drag | Boolean | true | ֧��������ק����
indexBind | Boolean | true | ����Ԫ�ص��������λ
noAnimate | Boolean | false | �رն���
animation | String | ease-out-back | ָ������Ч������ѡ����`ease-out-back`��`linear`
extendAnimate | Object | - | ������չ����Ч������������`swing`��`ease-in`��
fullMode | Boolean | false |slider���С���������һ��������ƫ�Ƶ�����½��鿪�������ܸ���

## ����

������ | ���� | ˵��
---- | ---- | ----
prev | - | ����ǰһ��
next | - | �����һ��
setIndexTo | index | ������λ��ĳ����Ƽ�ʹ�ã�������moveTo���
moveTo | index, isImmediate | ������ĳ��, �ڶ������������Ƿ�����������������λ
refresh | config | ˢ����������������趨������
destroy | - | �������

---------------

### [�鿴DEMO](http://ajccom.github.io/niceslider/)

