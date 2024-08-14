import { definePage } from '@vue-mini/core';

definePage(() => {
  function onClickOpenWx() {
    void wx.previewImage({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      current: process.env.OPEN_WX_QR_CODE_BIG_URL!,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      urls: [process.env.OPEN_WX_QR_CODE_BIG_URL!],
    });
  }

  function onClickMySelfWx() {
    void wx.previewImage({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      current: process.env.MY_SELF_WX_QR_CODE_BIG_URL!,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      urls: [process.env.MY_SELF_WX_QR_CODE_BIG_URL!],
    });
  }
  function onCallPhone() {
    void wx.makePhoneCall({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      phoneNumber: process.env.MY_PHONE_NUMBER!,
    });
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    openWxQrCodeUrl: process.env.OPEN_WX_QR_CODE_URL,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    mySelfWxQrCodeUrl: process.env.MY_SELF_WX_QR_CODE_URL,
    onClickOpenWx,
    onClickMySelfWx,
    onCallPhone,
  };
});
