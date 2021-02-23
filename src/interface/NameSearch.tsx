import React, { FormEvent, useState, useEffect, useRef, useMemo } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useFetch, FetchError } from 'react-async';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore react-select-search has a broken import so we need to manually do it. See https://github.com/tbleckert/react-select-search/issues/120
import SelectSearch from 'react-select-search/dist/cjs';
import { Trans, t } from '@lingui/macro';
import { makeGuildApiUrl, makeCharacterApiUrl } from 'common/makeApiUrl';
import makeGuildPageUrl from 'common/makeGuildPageUrl';
import makeCharacterPageUrl from 'common/makeCharacterPageUrl';
import REALMS from 'game/RealmList';
import AlertDanger from 'interface/AlertDanger';

export enum SearchType {
  CHARACTER = 'Character',
  GUILD = 'Guild',
}

interface Props extends RouteComponentProps {
  type: SearchType;
}

function NameSearch(props: Props) {
  const [region, setRegion] = useState('EU')
  const [realm, setRealm] = useState('')
  const [name, setName] = useState('')
  const [failedAttempt, setFailedAttempt] = useState(false)

  const regionInput = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (regionInput?.current?.value) {
      regionInput.current.focus()
    }
  }, [])

  const asyncState = useFetch('', {}, {defer: true});

  asyncState.promise
    .then(() => {
      const makePageUrl = props.type === SearchType.CHARACTER ? makeCharacterPageUrl : makeGuildPageUrl;
      props.history.push(makePageUrl(region, realm, name));
    })
    .catch(() => {
      // ignore error, handled by react-async
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (asyncState.isPending) {
      return;
    }

    if (!region || !realm || !name) {
      setFailedAttempt(true)
      return;
    }

    // Skip CN-API due to blizzard restrictions (aka there is no API for CN)
    if (region === 'CN') {
      return;
    }

    if (props.type === SearchType.GUILD) {
      asyncState.run({resource: makeGuildApiUrl(region, realm, name)});
    } else {
      asyncState.run({resource: makeCharacterApiUrl(undefined, region, realm, name)});
    }
  }

  const changeRegion = (targetRegion: string) => {
    let newRealm = realm;
    // If the new region doesn't have a realm by the same name, clear the input
    if (!REALMS[targetRegion].some(realm => realm.name === newRealm)) {
      newRealm = '';
    }
    setRegion(targetRegion);
    setRealm(newRealm);
  }

  const realmOptions = useMemo(() =>
    REALMS[region].map(elem => ({ value: elem.name, name: elem.name })),
    [region]
  );

  const namePlaceholder = props.type === SearchType.CHARACTER ? t({
    id: 'interface.nameSearch.character',
    message: `Character`,
  }) : t({
    id: 'interface.nameSearch.guild',
    message: `Guild`,
  });

  return (
    <>
      <form onSubmit={handleSubmit} className="character-guild-selector">
        <select
          className="form-control region"
          ref={regionInput}
          defaultValue={region}
          onChange={e => changeRegion(e.target.value)}
        >
          {Object.keys(REALMS).map(elem => (
            <option key={elem} value={elem}>
              {elem}
            </option>
          ))}
        </select>
        <SelectSearch
          key={region}
          className={`realm ${failedAttempt && !realm.length ? 'error': ''}`}
          search
          options={realmOptions}
          value={realm}
          onChange={setRealm}
          placeholder={t({
            id: "interface.nameSearch.realm",
            message: `Realm`
          })}
        />
        <input
          type="text"
          name="code"
          onChange={e => setName(e.target.value)}
          className={`name form-control ${failedAttempt && !name.length ? 'error' : ''}`}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder={namePlaceholder}
        />
        <button
          type="submit"
          className={`btn btn-primary analyze animated-button ${
            asyncState.isPending ? 'fill-button' : ''
          }`}
        >
          <Trans id="interface.nameSearch.search">Search</Trans>
          <span className="glyphicon glyphicon-chevron-right" aria-hidden />
        </button>
      </form>
      {asyncState.isRejected &&
        <NameSearchError
          response={(asyncState.error as FetchError).response}
          name={name}
          realm={realm}
        />
      }
    </>
  );
}

interface NameSearchErrorProps {
  response: Response
  name: string
  realm: string
}

function NameSearchError({ response, name, realm }: NameSearchErrorProps) {
  if (response.status === 500) {
    return (
      <AlertDanger>
        <Trans id="interface.nameSearch.noResponse">
          It looks like we couldn't get a response in time from the API. Try and paste your report-code manually.
        </Trans>
      </AlertDanger>
    );
  } else if (response.status === 404) {
    return (
      <AlertDanger>
        <Trans id="interface.nameSearch.nameNotFound">
          {name} not found on ${realm}. Double check the region, realm, and name.
        </Trans>
      </AlertDanger>
    );
  } else if (!response.ok) {
    return (
      <AlertDanger>
        <Trans id="interface.nameSearch.noAPIResponse">
          It looks like we couldn't get a response in time from the API, this usually happens when the servers are under heavy load. Please try and use your report-code or try again later.
        </Trans>
      </AlertDanger>
    );
  }

  return null
}

export default withRouter(NameSearch);
