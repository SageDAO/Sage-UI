import { useGetPresetDropsQuery } from "@/store/dropsReducer";
import LoaderDots from "../LoaderDots";

export default function PresetDropsPanel() {

    const { data: presetDrops, isLoading, isError } = useGetPresetDropsQuery();

    if (isLoading) {
        return <LoaderDots />;
    }
    if (isError) {
        return <><br/>Unable to load preset data from AWS S3. Please try again later.</>
    }
  
    return <div></div>;
}