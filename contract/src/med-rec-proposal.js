// @ts-check
import { E } from '@endo/far';

console.warn('start proposal module evaluating');

/**
 * Core eval script to start contract
 *
 * @param {BootstrapPowers} permittedPowers
 */
export const startPatientDataContract = async permittedPowers => {
  console.error('startPatientDataContract()...');
  const {
    consume: { board, chainStorage, startUpgradable, zoe },
    brand: {
      consume: { IST: istBrandP },
      // @ts-expect-error dynamic extension to promise space
      produce: brandProducers,
    },
    issuer: {
      consume: { IST: istIssuerP },
      // @ts-expect-error dynamic extension to promise space
      produce: issueProducers,
    },
    installation: {
      consume: { patientData: patientDataInstallationP },
    },
    instance: {
      // @ts-expect-error dynamic extension to promise space
      produce: { patientData: produceInstance },
    },
  } = permittedPowers;

  // print all the powers
  console.log(
    '**************************************************',
    permittedPowers,
  );

  const storageNode = await E(chainStorage).makeChildNode('patientData');
  const istIssuer = await istIssuerP;

  const terms = { maxPatients: 100n };

  // agoricNames gets updated each time; the promise space only once XXXXXXX
  const installation = await patientDataInstallationP;

  const { instance } = await E(startUpgradable)({
    installation,
    issuerKeywordRecord: { Price: istIssuer },
    label: 'patientData',
    terms,
    privateArgs: {
      storageNode,
      board,
    },
  });
  console.log('CoreEval script: started contract', instance);
  const { brands, issuers } = await E(zoe).getTerms(instance);

  console.log('CoreEval script: share via agoricNames:', {
    brands,
    issuers,
  });

  produceInstance.reset();
  produceInstance.resolve(instance);
  console.log('patientData (re)started');
};

/** @type { import("@agoric/vats/src/core/lib-boot").BootstrapManifest } */
const patientDataManifest = {
  [startPatientDataContract.name]: {
    consume: {
      agoricNames: true,
      board: true, // to publish boardAux info for NFT brand
      chainStorage: true, // to publish boardAux info for NFT brand
      startUpgradable: true, // to start contract and save adminFacet
      zoe: true, // to get contract terms, including issuer/brand
    },
    installation: { consume: { patientData: true } },
    issuer: {
      consume: { IST: true },
      produce: { IST: true },
    },
    brand: {
      consume: { IST: true },
      produce: { IST: true },
    },
    instance: { produce: { patientData: true } },
  },
};
harden(patientDataManifest);

export const getManifestForPatientData = (
  { restoreRef },
  { patientDataRef },
) => {
  return harden({
    manifest: patientDataManifest,
    installations: {
      patientData: restoreRef(patientDataRef),
    },
  });
};
