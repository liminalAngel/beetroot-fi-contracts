import { toNano, Address } from '@ton/core';
import { Main } from '../wrappers/Main';
import { compile, NetworkProvider } from '@ton/blueprint';
import { jettonWalletCodeFromLibrary } from '../helpers/utils';

export async function run(provider: NetworkProvider) {
    const userScCode = await compile('User');

    const jettonWalletGovernedCodeRaw = await compile('JettonWalletGoverned');
    const jettonWalletGovernedCode = jettonWalletCodeFromLibrary(jettonWalletGovernedCodeRaw);

    const jettonWalletCode = await compile('JettonWallet');

    const main = provider.open(Main.createFromConfig({
        usdtJettonMasterAddress: Address.parse(''),
        rootMasterAddress: Address.parse(''),
        userScCode: userScCode,
        adminAddress: Address.parse(''),
        jettonWalletGovernedCode: jettonWalletGovernedCode,
        jettonWalletCode: jettonWalletCode,
        rootPrice: 100n,
    }, await compile('Main')));

    await main.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(main.address);
}
