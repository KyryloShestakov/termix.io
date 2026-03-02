import PageWrapper from "@/components/Layout/PageWrapper";
import MainViewController from "@/components/Main/Main-view-controller";
import {loadPageData} from "@/lib/loaders/load-page-data";

export default async function Home() {
    const data = await loadPageData()
    return (
        <PageWrapper user={data?.user}>
            <MainViewController user={data?.user ?? null} videos={data?.videos ?? []}/>
        </PageWrapper>
    );
}
