import React, {useState} from 'react';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme} from "victory";
import useDimensions from "@/hooks/use-dimensions";
import {isAfter, subDays, subMonths, subWeeks} from "date-fns";
import {IProfileRatingsResult} from "@/helper/api.types";
import {formatDateShort, formatMonth, formatTime, formatYear} from "@/helper/util";
import {merge} from "lodash";

interface IRatingProps {
    ratingHistories: IProfileRatingsResult;
}

function getLeaderboardColor(leaderboardId: string) {
    return 'var(--text-main)';
}

export default function Rating({ratingHistories}: IRatingProps) {
    const [ratingHistoryDuration, setRatingHistoryDuration] = useState('max');

    const values: string[] = [
        'max',
        '3m',
        '1m',
        '1w',
        '1d',
    ];

    const formatTick = (tick: any, index: number, ticks: any[]) => {

        // console.log(tick);
        // console.log(ticks);

        const date = ticks[index] as Date;
        if (date.getMonth() == 0 && date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatYear(date);
        }
        if (date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatMonth(date);
        }
        if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatDateShort(date);
        }
        return formatTime(ticks[index]);
    };

    const [measureRef, {width}] = useDimensions();
    // console.log('WIDTH', width);
    // const [size, onLayout] = useComponentSize();
    // console.log('size', size);

    let since: any = null;
    switch (ratingHistoryDuration) {
        case '3m':
            since = subMonths(new Date(), 3);
            break;
        case '1m':
            since = subMonths(new Date(), 1);
            break;
        case '1w':
            since = subWeeks(new Date(), 1);
            break;
        case '1d':
            since = subDays(new Date(), 1);
            break;
    }

    // ratingHistories = ratingHistories?.map(r => ({
    //     leaderboard_id: r.leaderboardId,
    //     ratings: r.ratings.filter(d => d.rating > 0),
    // }));

    if (ratingHistories && since != null) {
        ratingHistories = ratingHistories.map(r => ({
            ...r,
            // leaderboard_id: r.leaderboard_id,
            ratings: r.ratings.filter(d => isAfter(d.date!, since)),
        }));
    }

    const sampleData = (data: any[]) => {
        const maxPoints = 100;
        const filtered = data;

        if (filtered.length > maxPoints) {
            const k = Math.ceil(filtered.length / maxPoints);
            return filtered.filter(
                (d, i) => ((i % k) === 0)
            );
        }
        return filtered;
    }

    ratingHistories = ratingHistories?.map(r => ({
        ...r,
        ratings: sampleData(r.ratings),
    }));

    const themeCustomizations = {
        axis: {
            style: {
                tickLabels: {
                    fill: 'var(--text-main)',
                },
            },
        },
    };

    const chartTheme = merge({...VictoryTheme.material}, themeCustomizations);

    return (
        <div className="flex flex-col">

            {/*<div className="flex flex-row">*/}
            {/*    <div className="flex-1"/>*/}
            {/*    /!*<ToggleButtonGroup value={ratingHistoryDuration} exclusive*!/*/}
            {/*    /!*                   onChange={(e, v) => setRatingHistoryDuration(v)} size="small">*!/*/}
            {/*    /!*    {*!/*/}
            {/*    /!*        values.map(value => (*!/*/}
            {/*    /!*            <ToggleButton key={value} value={value} size={"small"}>*!/*/}
            {/*    /!*                <div className={classes.option}>{value}</div>*!/*/}
            {/*    /!*            </ToggleButton>*!/*/}
            {/*    /!*        ))*!/*/}
            {/*    /!*    }*!/*/}
            {/*    /!*</ToggleButtonGroup>*!/*/}
            {/*</div>*/}
            {/*<br/>*/}

            {/*{*/}
            {/*    !ratingHistories &&*/}
            {/*    <Skeleton variant="rect" height={345}/>*/}
            {/*}*/}

            {
                ratingHistories &&
                <div ref={measureRef} style={{height:300}}>
                    {
                        width &&
                        <VictoryChart
                            width={width} height={300}
                            theme={chartTheme}
                            padding={{left: 50, bottom: 30, top: 20, right: 20}}
                            scale={{x: "time"}}
                        >
                            <VictoryAxis crossAxis tickFormat={formatTick}
                                         tickCount={width ? Math.round(width / 60) : 100}/>
                            <VictoryAxis dependentAxis crossAxis/>
                            {
                                ratingHistories?.map(ratingHistory => (
                                    <VictoryLine
                                        name={'line-' + ratingHistory.leaderboardId}
                                        key={'line-' + ratingHistory.leaderboardId}
                                        data={ratingHistory.ratings}
                                        x="date"
                                        y="rating" style={{
                                        data: {stroke: getLeaderboardColor(ratingHistory.leaderboardId)}
                                    }}
                                    />
                                ))
                            }
                            {
                                ratingHistories?.map(ratingHistory => (
                                    <VictoryScatter
                                        name={'scatter-' + ratingHistory.leaderboardId}
                                        key={'scatter-' + ratingHistory.leaderboardId}
                                        data={ratingHistory.ratings}
                                        x="date"
                                        y="rating"
                                        size={1.5}
                                        style={{
                                            data: {fill: getLeaderboardColor(ratingHistory.leaderboardId)}
                                        }}
                                    />
                                ))
                            }
                        </VictoryChart>
                    }
                </div>
            }

            {/*{*/}
            {/*    ratingHistories &&*/}
            {/*    <div className={classes.legend}>*/}
            {/*        {*/}
            {/*            (ratingHistories || Array(2).fill(0)).map((ratingHistory, i) => (*/}
            {/*                <span*/}
            {/*                    key={'legend-' + i}*/}
            {/*                    style={{*/}
            {/*                        paddingLeft: 10,*/}
            {/*                        paddingRight: 10,*/}
            {/*                        paddingTop: 5,*/}
            {/*                        paddingBottom: 5,*/}
            {/*                        // fontSize: 12,*/}
            {/*                        color: getLeaderboardTextColor(ratingHistory.leaderboard_id, paperTheme.dark)*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    {formatLeaderboardId(ratingHistory.leaderboard_id)}*/}
            {/*                </span>*/}
            {/*            ))*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*}*/}
        </div>
    )
}


// const useStyles = makeStyles((theme) => ({
//     option: {
//         padding: theme.spacing(0, 1),
//     },
//     row3: {
//         display: 'flex',
//         alignItems: 'center',
//         marginBottom: theme.spacing(2),
//     },
//     chart: {
//         backgroundColor: 'yellow',
//         width: '100%',
//     },
//     durationRow: {
//         // backgroundColor: 'green',
//         flexDirection: 'row',
//         justifyContent: 'center',
//         // justifyContent: 'flex-end',
//         marginBottom: 10,
//     },
//     container: {
//         // backgroundColor: 'green',
//         position: "relative"
//     },
//     legend: {
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         flexWrap: 'wrap',
//         marginHorizontal: -8,
//         marginTop: 10,
//         // backgroundColor: 'red',
//     },
//     legendDesc: {
//         textAlign: 'center',
//         fontSize: 12
//     },
// }));
