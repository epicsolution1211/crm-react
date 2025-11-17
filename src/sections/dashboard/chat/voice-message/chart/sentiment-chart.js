import { useMemo, useRef } from 'react';
import { Line, XAxis, YAxis, Legend, Tooltip, LineChart, ReferenceLine, CartesianGrid } from "recharts";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/system/colorManipulator';

const addMissingSegments = (data) => {
  const updatedSentences = [];

  data.forEach((segment) => {
    const { sentences, speaker, sentiment_score } = segment;

    sentences.forEach((sentence, sentenceIndex) => {
      const { start: sentenceStart } = sentence;

      if (sentenceIndex > 0) {
        const previousSentenceEnd = sentences[sentenceIndex - 1].end;
        if (sentenceStart - previousSentenceEnd > 0.1) {
          updatedSentences.push({
            text: "",
            start: previousSentenceEnd,
            end: sentenceStart,
            sentiment: "neutral",
            sentiment_score, 
            speaker,
          });
        }
      }

      updatedSentences.push({
        ...sentence,
        speaker, // Assign the speaker to all sentences
      });
    });
  });

  return updatedSentences;
}

const generateTimeBasedData = (sentences, intervalDuration = 0.1) => {
  const timeData = [];
  const lastSentence = sentences[sentences.length - 1];
  const endTime = lastSentence.end; // Last time of the last element

  let currentedTime = intervalDuration; // Start from 0.1

  // Initialize all times with empty objects for speakers
  while (currentedTime <= endTime) {
    timeData.push({
      time: currentedTime.toFixed(1),
      sentiment_scores: {}, // Initialize as an object to hold scores for each speaker
    });
    currentedTime += intervalDuration;
  }

  // Process sentences and populate the timeData
  sentences.forEach(sentence => {
    let time = Math.ceil(sentence.start * 10) / 10; // Round up the start to the nearest 0.1
    while (time <= sentence.end) {
      const existingEntry = timeData.find(item => item.time == time.toFixed(1));
      if (existingEntry) {
        existingEntry.sentiment_scores[`speaker${sentence.speaker + 1}`] = sentence.sentiment_score;
      }
      time += intervalDuration;
    }
  });

  return timeData;
};

const structureTimeBasedData = (timeArray) => timeArray.map(({ time, sentiment_scores }) => ({
  time: parseFloat(time),
  ...sentiment_scores 
}));

export const SentimentChart = ({ message }) => {
  const theme = useTheme();

  const lineRef = useRef()

  const structuredData = useMemo(()=> {
    if(message) {
      const transcript = addMissingSegments(message?.transcript_data?.paragraphs);

      const positiveSentimentScores = transcript?.filter(sentence => sentence.sentiment === "positive")
        ?.map(sentence => sentence.sentiment_score) ?? [];
      const negativeSentimentScores = transcript?.filter(sentence => sentence.sentiment === "negative")
        ?.map(sentence => sentence.sentiment_score) ?? [];

      const averagePositive = positiveSentimentScores?.length > 0 ? positiveSentimentScores?.reduce((sum, score) => sum + score, 0) / positiveSentimentScores.length: 0;
      const averageNegative = negativeSentimentScores.length > 0 ? negativeSentimentScores?.reduce((sum, score) => sum + score, 0) / negativeSentimentScores.length : 0;

      const averagePosi= Math.round(averagePositive * 10) / 10;
      const averageNega= Math.round(averageNegative * 10) / 10;

      const timeBasedData = generateTimeBasedData(transcript, 0.1);
      const structuredList = structureTimeBasedData(timeBasedData);
      return {
        sentimentList: structuredList ?? [],
        averagePositive: averagePosi,
        averageNegative: averageNega,
      }
    }
  }, [message]);

  const formatTime = (timeValue) => {
    const totalSeconds = Math.round(timeValue);
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const RenderCustomAxisTick = ({ x, y, payload }) => {
    let path = '';
  
    switch (payload.value) {
      case structuredData?.averagePositive:
        path = <path fill={theme.palette.success.main} d="M12 13.5q-1.35 0-2.537.588T7.55 15.8q-.275.4-.075.8t.65.4q.2 0 .363-.088t.287-.262q.575-.775 1.425-1.212T12 15t1.8.438t1.425 1.212q.1.175.263.263t.362.087q.45 0 .65-.413t-.075-.837q-.725-1.1-1.912-1.675T12 13.5m3.5-2.5q.625 0 1.063-.437T17 9.5t-.437-1.062T15.5 8t-1.062.438T14 9.5t.438 1.063T15.5 11m-7 0q.625 0 1.063-.437T10 9.5t-.437-1.062T8.5 8t-1.062.438T7 9.5t.438 1.063T8.5 11M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/>;
        break;
      case structuredData?.averageNegative:
        path = <path fill={theme.palette.error.main} d="M12 13.5q-1.35 0-2.537.588T7.55 15.8q-.275.4-.075.8t.65.4q.2 0 .363-.088t.287-.262q.575-.775 1.425-1.212T12 15t1.8.438t1.425 1.212q.1.175.263.263t.362.087q.45 0 .65-.413t-.075-.837q-.725-1.1-1.912-1.675T12 13.5m3.5-2.5q.625 0 1.063-.437T17 9.5t-.437-1.062T15.5 8t-1.062.438T14 9.5t.438 1.063T15.5 11m-7 0q.625 0 1.063-.437T10 9.5t-.437-1.062T8.5 8t-1.062.438T7 9.5t.438 1.063T8.5 11M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/>;
        break;
      case 0:
        path = <path fill={theme.palette.neutral[500]} d="M15.5 11q.625 0 1.063-.437T17 9.5t-.437-1.062T15.5 8t-1.062.438T14 9.5t.438 1.063T15.5 11m-7 0q.625 0 1.063-.437T10 9.5t-.437-1.062T8.5 8t-1.062.438T7 9.5t.438 1.063T8.5 11m.5 4.5h6V14H9zm3 6.5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/>;
        break;
      default:
        path = '';
    }
    return (
      <svg x={x - 24} y={y - 12} width={24} height={24} viewBox="0 0 24 24">
        {path}
      </svg>
    );
  };

  const RenderCustomTooltip = ({ payload, active }) => {
    if (active) {
      return (
        <Stack 
          className="custom-tooltip" 
          direction='column' 
          sx={{
            backdropFilter: 'blur(6px)',
            background: 'transparent',
            boxShadow: 'none',
            borderRadius: 2,
          }}>
          <Typography 
            sx={{
              background: alpha(theme.palette.neutral[900], 0.8),
              color: theme.palette.common.white,
              fontSize: 14,
              p: 1,
            }}
            variant='subtitle1'
          >
            Score ({formatTime(payload?.[0]?.payload?.time)})
          </Typography>
          <Stack 
            sx={{
              background: alpha(theme.palette.neutral[900], 0.4),
              color: theme.palette.common.white,
              p: 1,
              pt: 0,
            }}
          >
            {payload?.[0]?.payload?.speaker1 &&
              <Stack direction='row' gap={0.5} alignItems='center'>
                <Box sx={{ minWidth: 12, minHeight: 12, backgroundColor: '#83c4fb', color:'#83c4fb', borderRadius: 50 }}></Box>
                <Typography fontSize={12} sx={{ color: ''}}>
                  Speaker1 : {payload?.[0]?.payload?.speaker1}
                </Typography>
              </Stack>
            }
            {payload?.[0]?.payload?.speaker2 &&
              <Stack direction='row' gap={0.5} alignItems='center'>
                <Box sx={{ minWidth: 12, minHeight: 12, backgroundColor: '#ec71b2', color:'#ec71b2', borderRadius: 50 }}></Box>
                <Typography fontSize={12} sx={{ color: ''}}>
                  Speaker2 : {payload?.[0]?.payload?.speaker2}
                </Typography>
              </Stack>
            }
            {payload?.[0]?.payload?.speaker3 &&
              <Typography fontSize={12} sx={{ color: ''}}>
                Speaker3: {payload?.[0]?.payload?.speaker3}
              </Typography>
            }
          </Stack>
        </Stack>
      );
    }
  
    return null;
  }

  const RenderCustomLegend = ({ payload }) => (
    <Stack direction='row' alignItems='center' gap={2} sx={{ maxWidth: 520, width: 1, justifyContent: 'center', pl: 12 }}>
      {payload?.map((item) => (
        <Stack direction='row' gap={0.5} alignItems='center'>
          <Box sx={{ minWidth: 12, minHeight: 12, backgroundColor: item.color, color: item.color, borderRadius: 50 }}></Box>
          <Typography fontSize={12} sx={{ textTransform: 'capitalize' }}>
            {item.value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )

  return (
    <Stack direction="column" gap={2} pt={2}>
      <Typography sx={{ fontSize: 22, fontWeight: 500, pl: 1, color: 'text.primary' }}>
        Sentiment Analysis
      </Typography>
      <LineChart
        width={550}
        height={300}
        data={structuredData?.sentimentList??[]}
        margin={{
          left: -4,
        }}
      >
        <YAxis
          ticks={[structuredData?.averageNegative, 0, structuredData?.averagePositive]}
          domain={[structuredData?.averageNegative, structuredData?.averagePositive]}
          axisLine={{ stroke: '#2d3748' }}
          tick={<RenderCustomAxisTick />}
        />
        <XAxis 
          tick={false}
          axisLine={{ stroke: '#2d3748' }}
        />
        <CartesianGrid vertical={false} horizontal={false} />
        <Legend content={<RenderCustomLegend/>}/>
        <Tooltip content={<RenderCustomTooltip />}/>
        <Line 
          type="monotone" 
          dataKey="speaker1" 
          stroke="#83c4fb" 
          dot={false} 
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="speaker2" 
          stroke='#ec71b2'
          activeDot={{ r: 4 }}
          dot={false} 
          strokeWidth={2}
        />
         <ReferenceLine 
          y={structuredData?.averagePositive} 
          stroke={theme.palette.success.main} 
          strokeDasharray="3 3"
          label={structuredData?.averagePositive}
        />
         <ReferenceLine 
          y={0} 
          stroke="gray" 
          strokeDasharray="3 3" 
        />
         <ReferenceLine
          ref={lineRef}
          y={structuredData?.averageNegative} 
          stroke={theme.palette.error.main} 
          strokeDasharray="3 3"
          label={structuredData?.averageNegative}
        />
      </LineChart>
    </Stack>
  );
};