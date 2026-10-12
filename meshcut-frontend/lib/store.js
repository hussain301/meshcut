"use client";
import { createContext, useContext, useState, useCallback, useMemo } from "react";

const MeshContext = createContext(null);

export function MeshProvider({ children }) {
  const [uploads, setUploads] = useState([]);
  const [currentClip, setCurrentClipState] = useState(null);
  const [trim, setTrimState] = useState({ start: 0, end: 0 });
  const [clips, setClipsState] = useState([]);
  const [textOverlays, setTextOverlays] = useState([]);
  const [filters, setFiltersState] = useState({ brightness: 100, contrast: 100, saturation: 100 });
  const [exportJobs, setExportJobs] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLangState] = useState("en");
  const [timeline, setTimelineState] = useState({ currentTime: 0, zoom: 80, markers: [] });

  // uploads: {id,name,size,status,progress,url,clip_id,duration,error}
  const addUpload = useCallback((u) => {
    setUploads((prev) => [...prev, u]);
  }, []);
  const updateUpload = useCallback((id, patch) => {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }, []);
  const removeUpload = useCallback((id) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const setCurrentClip = useCallback((c) => {
    setCurrentClipState(c);
  }, []);

  const setTrim = useCallback((t) => {
    setTrimState(t);
  }, []);

  // clips: {clip_id,url,name,duration,transition}
  const setClips = useCallback((c) => {
    setClipsState(c);
  }, []);
  const addClip = useCallback((c) => {
    setClipsState((prev) => [...prev, c]);
  }, []);
  const removeClip = useCallback((id) => {
    setClipsState((prev) => prev.filter((c) => c.clip_id !== id));
  }, []);
  const reorderClips = useCallback((fromIdx, toIdx) => {
    setClipsState((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, []);
  const setClipTransition = useCallback((id, transition) => {
    setClipsState((prev) =>
      prev.map((c) => (c.clip_id === id ? { ...c, transition } : c))
    );
  }, []);

  // textOverlays: {id,text,x,y,font,size,color,start,end}
  const addTextOverlay = useCallback((o) => {
    setTextOverlays((prev) => [...prev, o]);
  }, []);
  const updateTextOverlay = useCallback((id, patch) => {
    setTextOverlays((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch } : o))
    );
  }, []);
  const removeTextOverlay = useCallback((id) => {
    setTextOverlays((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const setFilters = useCallback((f) => {
    setFiltersState(f);
  }, []);

  // exportJobs: {jobId,status,progress,downloadUrl,format,quality}
  const addExportJob = useCallback((j) => {
    setExportJobs((prev) => [...prev, j]);
  }, []);
  const updateExportJob = useCallback((jobId, patch) => {
    setExportJobs((prev) =>
      prev.map((j) => (j.jobId === jobId ? { ...j, ...patch } : j))
    );
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const setLang = useCallback((l) => {
    setLangState(l);
  }, []);

  const setCurrentTime = useCallback((t) => {
    setTimelineState((prev) => ({ ...prev, currentTime: t }));
  }, []);
  const setZoom = useCallback((z) => {
    setTimelineState((prev) => ({ ...prev, zoom: z }));
  }, []);
  const addMarker = useCallback((m) => {
    setTimelineState((prev) => ({ ...prev, markers: [...prev.markers, m] }));
  }, []);
  const removeMarker = useCallback((id) => {
    setTimelineState((prev) => ({
      ...prev,
      markers: prev.markers.filter((m) => m.id !== id),
    }));
  }, []);

  const value = useMemo(
    () => ({
      uploads,
      currentClip,
      trim,
      clips,
      textOverlays,
      filters,
      exportJobs,
      darkMode,
      lang,
      timeline,
      addUpload,
      updateUpload,
      removeUpload,
      setCurrentClip,
      setTrim,
      setClips,
      addClip,
      removeClip,
      reorderClips,
      setClipTransition,
      addTextOverlay,
      updateTextOverlay,
      removeTextOverlay,
      setFilters,
      addExportJob,
      updateExportJob,
      toggleDarkMode,
      setLang,
      setCurrentTime,
      setZoom,
      addMarker,
      removeMarker,
    }),
    [
      uploads,
      currentClip,
      trim,
      clips,
      textOverlays,
      filters,
      exportJobs,
      darkMode,
      lang,
      timeline,
      addUpload,
      updateUpload,
      removeUpload,
      setCurrentClip,
      setTrim,
      setClips,
      addClip,
      removeClip,
      reorderClips,
      setClipTransition,
      addTextOverlay,
      updateTextOverlay,
      removeTextOverlay,
      setFilters,
      addExportJob,
      updateExportJob,
      toggleDarkMode,
      setLang,
      setCurrentTime,
      setZoom,
      addMarker,
      removeMarker,
    ]
  );

  return <MeshContext.Provider value={value}>{children}</MeshContext.Provider>;
}

export function useMesh() {
  return useContext(MeshContext);
}
