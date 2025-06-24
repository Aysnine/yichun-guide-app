import { useFlags } from '@/context/FlagsContext';
import { definePage } from '@vue-mini/core';

definePage(() => {
  function onClickOpenWx() {
    void wx.previewImage({
      current: process.env.OPEN_WX_QR_CODE_BIG_URL!,
      urls: [process.env.OPEN_WX_QR_CODE_BIG_URL!],
    });
  }

  function onClickMySelfWx() {
    void wx.previewImage({
      current: process.env.MY_SELF_WX_QR_CODE_BIG_URL!,
      urls: [process.env.MY_SELF_WX_QR_CODE_BIG_URL!],
    });
  }
  function onCallPhone() {
    void wx.makePhoneCall({
      phoneNumber: process.env.MY_PHONE_NUMBER!,
    });
  }

  return {
    flags: useFlags(),

    openWxQrCodeUrl: process.env.OPEN_WX_QR_CODE_URL,
    mySelfWxQrCodeUrl: process.env.MY_SELF_WX_QR_CODE_URL,
    onClickOpenWx,
    onClickMySelfWx,
    onCallPhone,
  };
});
