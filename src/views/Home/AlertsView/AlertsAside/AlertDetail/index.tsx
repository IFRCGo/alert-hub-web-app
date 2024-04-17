import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import { Link } from 'react-router-dom';
import { ShareBoxFillIcon } from '@ifrc-go/icons';
import {
    Button,
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

import { AlertInfosQuery } from '#generated/types/graphql';

import AreaAlertInfo from '../AlertInfo';

import i18n from './i18n.json';
import styles from './styles.module.css';

type AletInfosType = NonNullable<NonNullable<AlertInfosQuery['public']>['alert']>;

type InfoAlertType = NonNullable<NonNullable<NonNullable<AlertInfosQuery['public']>['alert']>['infos']>[number];

type TabKey = string[];
const keySelector = (info: string) => Number(info);

export interface AlertProps {
    data: AletInfosType;
}

function AlertDetail(props: AlertProps) {
    const {
        data,
    } = props;

    const isUnknown = data?.admin1s?.map((admin) => admin.isUnknown);

    const strings = useTranslation(i18n);
    const [tabKeys, setTabKeys] = useState<TabKey>([]);
    const [activeTab, setActiveTab] = useState<string>(tabKeys?.[0]);

    const getTabName = useCallback((index: number) => `Info ${index + 1}`, []);

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

    const rendererParams = useCallback(
        (_: number, info: string, index: number, value: InfoAlertType) => ({
            title: getTabName(index),
            infoId: info,
            data: value,
        }),
        [getTabName],
    );

    return (
        <Container
            className={styles.alertDetails}
            childrenContainerClassName={styles.content}
            heading={data?.infos.map((info) => info.event)}
            headingLevel={5}
        >
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
            {isUnknown ? (
                <Button
                    name={undefined}
                    variant="primary"
                />
            ) : null}
            {data?.url ? (
                <Link
                    to={data?.url}
                    className={styles.contactButton}
                    target="_blank"
                >
                    <ShareBoxFillIcon />
                    {strings.alertOrigin}
                </Link>
            ) : null}
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
            <Container>
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
                        data={tabKeys}
                        renderer={AreaAlertInfo}
                        rendererParams={rendererParams}
                        keySelector={keySelector}
                        pending={false}
                        filtered={false}
                        errored={false}
                    />
                </Tabs>
            </Container>
        </Container>
    );
}

export default AlertDetail;
