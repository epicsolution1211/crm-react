import { getAssetPath } from "src/utils/asset-path";

export const Logo = () => {
  return (
    <img src={getAssetPath('/assets/logos/new-logo.svg')} width={45} height={45} />
    // <svg
    //   id="a"
    //   xmlns="http://www.w3.org/2000/svg"
    //   viewBox="0 0 101 101">
    //   <defs>
    //     <style>
    //     </style>
    //   </defs>
    //   <circle
    //     fill={colorInfo[color ?? 'indigo']}
    //     cx="44"
    //     cy="44"
    //     r="44" />
    //   <circle fill={colorInfo[color ?? 'indigo']}
    //     cx="57"
    //     cy="57"
    //     r="44"
    //     opacity='0.28' />
    // </svg>
  );
};
