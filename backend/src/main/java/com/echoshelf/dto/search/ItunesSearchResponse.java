package com.echoshelf.dto.search;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ItunesSearchResponse {
    private Integer resultCount;
    private List<ItunesAlbumDTO> results;

    public Integer getResultCount() { return resultCount; }
    public void setResultCount(Integer resultCount) { this.resultCount = resultCount; }
    public List<ItunesAlbumDTO> getResults() { return results; }
    public void setResults(List<ItunesAlbumDTO> results) { this.results = results; }
}
