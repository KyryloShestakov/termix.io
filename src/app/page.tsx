import PageWrapper from "@/components/Layout/PageWrapper";
import MainViewController from "@/components/Main/Main-view-controller";
import {loadPageData} from "@/lib/loaders/load-page-data";

export default async function Home() {
    const {user, videos} = await loadPageData()
    return (
        <PageWrapper user={user}>
            <MainViewController user={user ?? null} videos={videos ?? []}/>
        </PageWrapper>
    );
}
