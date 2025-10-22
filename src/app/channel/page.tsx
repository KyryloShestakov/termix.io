// src/app/channel/page.tsx
import PageWrapper from '@/components/Layout/PageWrapper';
import ChannelPage from '@/components/ChannelPage';

export default async function PageChannel() {

    return (
        <PageWrapper hideSidebar={true}>
            <ChannelPage/>
        </PageWrapper>
    );
}
