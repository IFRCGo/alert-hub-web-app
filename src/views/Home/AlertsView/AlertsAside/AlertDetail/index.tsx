import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import { Link } from 'react-router-dom';
import { ShareBoxFillIcon } from '@ifrc-go/icons';
import {
    Container,
    DateOutput,
    List,
    Tab,
    TabList,
    Tabs,
    TextOutput,
} from '@ifrc-go/ui';
import { useTranslation } from '@ifrc-go/ui/hooks';
import { listToMap } from '@togglecorp/fujs';

import { AlertInfoQuery } from '#generated/types/graphql';

import AlertInfo from './AlertInfo';

import i18n from './i18n.json';
import styles from './styles.module.css';

type InfoAlertType = NonNullable<NonNullable<AlertInfoQuery['public']>['alert']>;

export interface AlertProps {
    data: InfoAlertType;
}

type TabKey = string[];
const keySelector = (info: string) => Number(info);

function AlertDetail(props: AlertProps) {
    const {
        data,
    } = props;

    const strings = useTranslation(i18n);
    const [tabKeys, setTabKeys] = useState<TabKey>([]);
    const [activeTab, setActiveTab] = useState<string>(tabKeys?.[0]);

    const unknownAdmin1Alerts = data?.admin1s?.map((admin) => admin.isUnknown);

    useMemo(() => {
        const newList = listToMap(
            data?.infos ?? [],
            (d) => d.id,
            (d) => d?.language,
        );
        setTabKeys(Object.keys(newList));
        setActiveTab(Object.keys(newList)?.[0]);

        return newList;
    }, [data?.infos]);

    // NOTE: tab are dynamic as per language
    const getTabName = useCallback((index: number) => `Info ${index + 1}`, []);

    const rendererParams = useCallback((key: number, info: InfoAlertType) => ({
        infoId: key,
        data: info,
    }
    ), []);

    return (
        <Container
            className={styles.alertDetails}
            childrenContainerClassName={styles.content}
            heading={data?.info?.event}
            headingLevel={4}
        >
            {unknownAdmin1Alerts && (
                <div className={styles.alertButton}>
                    {strings.alertUnknownAdmin1}
                </div>
            )}
            <TextOutput
                label={strings.alertSender}
                value={(
                    <>
                        {data?.sender}
                        {' '}
                        (
                        <DateOutput value={data?.sent} />
                        )
                    </>
                )}
                withoutLabelColon
            />
            {data?.url && (
                <Link
                    to={data?.url}
                    className={styles.alertButton}
                    target="_blank"
                >
                    <ShareBoxFillIcon />
                    {strings.alertOrigin}
                </Link>
            )}
            <TextOutput
                label={strings.alertIdentifier}
                value={data?.identifier}
            />
            <TextOutput
                label={strings.alertScope}
                value={data?.scope}
            />
            <TextOutput
                label={strings.alertRestriction}
                value={data?.restriction}
            />
            <TextOutput
                label={strings.alertReference}
                value={data?.references}
            />
            <div className={styles.alertTabs}>
                <Tabs
                    value={activeTab}
                    onChange={setActiveTab}
                    variant="primary"
                >
                    <TabList>
                        {/* TODO: use list for tab */}
                        {tabKeys?.map((tab, index: number) => (
                            <Tab key={tab} name={tab}>
                                {getTabName(index)}
                            </Tab>
                        ))}
                    </TabList>
                    <List
                        data={data?.infos}
                        renderer={AlertInfo}
                        rendererParams={rendererParams}
                        keySelector={keySelector}
                        pending={false}
                        filtered={false}
                        errored={false}
                    />
                </Tabs>
            </div>
        </Container>
    );
}

export default AlertDetail;
