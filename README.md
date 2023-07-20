![](./media/header.png)

# IC-POS Notifications

This is a companion Netlify function for [IC-POS](https://github.com/kristoferlund/ic-pos), a simple Point of Sale app that allows users to accept ckBTC payments on the Internet Computer.

## Overview

When a merchant receives a payment, the IC-POS app wants to notify the merchant that a payment has been received. A notification comes in the form of either an SMS or an email.

The Internet Computer provides a feature that allows canisters to make [HTTPS outcalls](https://internetcomputer.org/docs/current/developer-docs/integrations/https-outcalls/https-outcalls-how-it-works) to conventional Web 2.0 HTTP servers.

This Netlify function serves as a gateway for the calls IC-POS makes when sending notifications. IC-POS could have made the calls directly to Courier, but since HTTPS outcalls require IPv6 addresses, and Courier does not have an IPv6 address, this function is needed to translate the call from IPv6 to IPv4.

## Deployment

See this deployment guide from Netlify for details on how to deploy a Netlify function: https://docs.netlify.com/functions/deploy/?fn-language=ts

## Known issues

None

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

- [kristofer@fmckl.se](mailto:kristofer@fmckl.se)
- Twitter: [@kristoferlund](https://twitter.com/kristoferlund)
- Discord: kristoferkristofer

## License

[MIT](LICENSE)
