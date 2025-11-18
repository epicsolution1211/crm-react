import { Seo } from "src/components/seo";
import { CasinoAppSettings } from "../../../../sections/dashboard/app-dashboard/settings/settings";

 function CasinoSettingPage () {

    return(
        <>
        <Seo title={`Casino App Settings`} />
            <CasinoAppSettings />
        </>
    )


}

export default CasinoSettingPage