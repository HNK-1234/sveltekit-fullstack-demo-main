import NeucronSDK from "neucron-sdk";

/** @type {import('./$types').Actions} */
export const actions = {
  login: async ({ request }) => {
    const data = await request.formData();
    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    try {
      const loginResponse = await authModule.login({ email: data.get('email'), password: data.get('password') });
      console.log('Login Response:', loginResponse);

      const defaultWalletBalance = await walletModule.getWalletBalance({});
      console.log('Default Wallet Balance:', defaultWalletBalance);

      return { success: true, balance: defaultWalletBalance.data.balance.summary };
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, message: 'Login failed' };
    }
  },
  pay: async ({ request }) => {
    const data = await request.formData();
    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    try {
      const loginResponse = await authModule.login({ email: data.get('email'), password: data.get('password') });
      console.log('Login Response:', loginResponse);

      const options = {
        outputs: [
          {
            address: data.get('paymail'),
            note: 'gurudakshina',
            amount: parseFloat(data.get('amount')) // Ensure amount is a number
          }
        ]
      };
      console.log('Payment Options:', options);

      const payResponse = await neucron.pay.txSpend(options);
      console.log('Payment Response:', payResponse);

      return { success: true, payment: payResponse };
    } catch (error) {
      console.error('Payment Error:', error);
      return { success: false, message: 'Payment failed' };
    }
  }
};
